const Course = require("../models/Course");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const Section = require("../models/Section");
const {
  notificationEmailTemplate,
} = require("../mail/templates/videoAvailable");
const mailSender = require("../utils/mailSender");
const { getOrFetchPlaylist } = require("../utils/youtubeService");
const { callAIAPI } = require("./aiChatController");

/**
 * Extract YouTube playlist ID from a URL string.
 */
function extractPlaylistId(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("list");
  } catch {
    // If it's not a URL, try it as a raw playlist ID
    return url;
  }
}

// Create a new course (or enroll in an existing one)
exports.createCourse = async (req, res) => {
  try {
    const { category, playlistUrl, videosPerDay, isEnded, userId } = req.body;

    // Validate required fields
    if (!playlistUrl || !category || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Extract playlist ID from URL
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid playlist URL" });
    }

    // Check if a course already exists for this playlist
    const existingCourse = await Course.findOne({ youtubePlaylistId: playlistId });

    if (existingCourse) {
      // Check if user is already enrolled
      const userAlreadyEnrolled = existingCourse.studentsEnrolled.some(
        (id) => id.toString() === userId.toString()
      );

      if (userAlreadyEnrolled) {
        return res.status(409).json({
          success: false,
          message: "You have already created a course with this playlist.",
          exist: true,
          data: existingCourse,
        });
      }

      // User NOT enrolled → enroll them in the existing course
      existingCourse.studentsEnrolled.push(userId);
      await existingCourse.save();

      const vPerDay = parseInt(videosPerDay) || 1;

      // Create CourseProgress for this user
      const courseProgress = await CourseProgress.create({
        userId,
        courseID: existingCourse._id,
        targetVideosPerDay: vPerDay,
        completedVideos: [],
      });

      // Update user document
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: {
              courseId: existingCourse._id,
              enrollmentDate: new Date(),
              videosPerDay: vPerDay,
            },
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: existingCourse,
        user,
        message: "Enrolled in existing course successfully",
        exist: true,
      });
    }

    // No existing course — fetch playlist data (uses cache for ended playlists)
    const { videos, channelTitle, thumbnail } = await getOrFetchPlaylist(
      playlistId,
      isEnded || false
    );

    // Check if category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Create the new course
    const newCourse = await Course.create({
      Author: channelTitle,
      category,
      youtubePlaylistId: playlistId,
      thumbnail,
      studentsEnrolled: [userId],
      discordLink: "",
    });

    // Bulk-create all sections at once instead of sequential API calls
    const vPerDay = parseInt(videosPerDay) || 1;
    const sectionDocs = videos.map((video, index) => ({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      videoId: video.videoId,
      releaseOffset: Math.floor(index / vPerDay),
      courseId: newCourse._id,
    }));

    const createdSections = await Section.insertMany(sectionDocs);

    // Update course with all section references
    newCourse.courseContent = createdSections.map((s) => s._id);
    await newCourse.save();

    // Create CourseProgress for the new course
    const courseProgress = await CourseProgress.create({
      userId,
      courseID: newCourse._id,
      targetVideosPerDay: vPerDay,
      completedVideos: [],
    });

    // Add course ID to the category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: {
            courseId: newCourse._id,
            enrollmentDate: new Date(),
            videosPerDay: vPerDay,
          },
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    // Respond with success for new course creation
    res.status(200).json({
      success: true,
      data: newCourse,
      user,
      message: "Course created successfully",
      exist: false,
    });
  } catch (error) {
    console.error("Error occurred while creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get Course Details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate("category")
      .populate("courseContent")
      .exec();

    const courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });
    if (!courseDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Course details not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
      message: "Course details fetched successfully",
    });
  } catch (error) {
    console.error("Error occurred while fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch course details",
      error: error.message,
    });
  }
};

// Optimized: batch queries instead of nested loops with individual lookups
exports.notifyUsers = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Fetch all sections with their course populated
    const sections = await Section.find({}).populate("courseId");

    // Group sections by courseId for efficient processing
    const sectionsByCourse = {};
    for (const section of sections) {
      if (!section.courseId) continue;
      const courseIdStr = section.courseId._id.toString();
      if (!sectionsByCourse[courseIdStr]) {
        sectionsByCourse[courseIdStr] = [];
      }
      sectionsByCourse[courseIdStr].push(section);
    }

    // Get all unique course IDs
    const courseIds = Object.keys(sectionsByCourse);
    if (courseIds.length === 0) return;

    // Fetch all users who have any of these courses in a single query
    const users = await User.find({
      "courses.courseId": { $in: courseIds },
    });

    // Track sent notifications to avoid duplicates and count total sent
    const notifiedSet = new Set();
    let sentCount = 0;

    console.log(`[NotifyUsers] Running daily email notification check for ${courseIds.length} course(s) and ${users.length} user(s)...`);

    for (const user of users) {
      for (const userCourse of user.courses) {
        if (!userCourse || !userCourse.courseId) continue;

        const courseIdStr = userCourse.courseId._id
          ? userCourse.courseId._id.toString()
          : userCourse.courseId.toString();

        const courseSections = sectionsByCourse[courseIdStr];
        if (!courseSections) continue;

        const enrollmentDate = new Date(userCourse.enrollmentDate);
        enrollmentDate.setHours(0, 0, 0, 0);

        const userProgress = await CourseProgress.findOne({
          courseID: courseIdStr,
          userId: user._id,
        });

        const userVideosPerDay =
          userCourse.videosPerDay || userProgress?.targetVideosPerDay || 1;

        for (let index = 0; index < courseSections.length; index++) {
          const section = courseSections[index];
          const userReleaseOffset = Math.floor(
            index / Math.max(1, userVideosPerDay)
          );
          const availableOn = new Date(enrollmentDate);
          availableOn.setDate(enrollmentDate.getDate() + userReleaseOffset);
          availableOn.setHours(0, 0, 0, 0);

          if (availableOn.getTime() === today.getTime()) {
            // Unique key to prevent duplicate notifications
            const notifKey = `${user._id}_${section._id}`;
            if (notifiedSet.has(notifKey)) continue;
            notifiedSet.add(notifKey);

            // Fetch student course progress to generate AI Daily Motivation text
            const userProgress = await CourseProgress.findOne({
              courseID: section.courseId._id,
              userId: user._id,
            });

            const completedCount = userProgress?.completedVideos?.length || 0;
            const totalVideos = courseSections.length;
            const remainingVideos = Math.max(0, totalVideos - completedCount);

            // Compute percentile rank among enrolled students
            const allProgressForCourse = await CourseProgress.find({
              courseID: section.courseId._id,
            });
            const lessOrEqual = allProgressForCourse.filter(
              (p) => (p.completedVideos ? p.completedVideos.length : 0) <= completedCount
            ).length;
            const totalEnrolled = Math.max(1, allProgressForCourse.length);
            const percentile = Math.round((lessOrEqual / totalEnrolled) * 100);
            const topPercent = Math.max(5, Math.min(50, 100 - percentile + 5));

            // Estimate days remaining
            const msPerDay = 24 * 60 * 60 * 1000;
            const daysEnrolled = Math.max(1, Math.floor((today - enrollmentDate) / msPerDay));
            const userPace = completedCount > 0 ? completedCount / daysEnrolled : 1;
            const daysRemaining = Math.max(1, Math.ceil(remainingVideos / Math.max(0.5, userPace)));

            // Option 5: AI Learning Buddy Daily Morning Message
            const yesterdayCompleted = Math.min(completedCount, userVideosPerDay || 1);
            const buddyPrompt = `Write a short 4-sentence AI Learning Buddy daily morning email for student ${user.firstName}. Yesterday they completed ${yesterdayCompleted} video(s). Today's lesson: "${section.title}". Give 1 encouraging study recommendation.`;

            let motivationMsg = await callAIAPI(buddyPrompt);

            if (!motivationMsg) {
              motivationMsg = `Good morning ${user.firstName}!\n\nYesterday you completed ${yesterdayCompleted} video${yesterdayCompleted !== 1 ? "s" : ""}.\n\nToday's lesson is about "${section.title}".\n\nI recommend staying focused and taking quick notes today to keep your streak going strong!\n\nGood luck! 🚀`;
            }

            const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
            const subject = `AI Learning Buddy: Good Morning ${user.firstName}! (${section.title})`;
            const htmlContent = notificationEmailTemplate(
              `${user.firstName} ${user.lastName}`,
              `🤖 SkillStep AI Learning Buddy`,
              motivationMsg.replace(/\n/g, "<br/>"),
              `${baseUrl}/view-course/${section.courseId._id}/${section._id}`,
              "Start Today's Lesson"
            );

            // Send email notification to the user
            console.log(`[NotifyUsers] Sending notification email to ${user.email} for section "${section.title}"...`);
            const mailResult = await mailSender(user.email, subject, htmlContent);
            if (mailResult) {
              sentCount++;
              console.log(`[NotifyUsers] Successfully sent email to ${user.email}`);
            } else {
              console.log(`[NotifyUsers] Failed to send email to ${user.email} (check mailSender logs/env)`);
            }
          }
        }
      }
    }

    console.log(`[NotifyUsers] Email notifications processed. Total emails sent: ${sentCount}`);
  } catch (error) {
    console.error("[NotifyUsers] Error notifying users:", error);
  }
};

// Express controller to manually trigger daily video email notifications
exports.triggerNotifications = async (req, res) => {
  try {
    await exports.notifyUsers();
    return res.status(200).json({
      success: true,
      message: "Daily video notification email check triggered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to trigger notifications",
      error: error.message,
    });
  }
};
