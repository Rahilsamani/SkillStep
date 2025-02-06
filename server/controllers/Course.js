const Course = require("../models/Course");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const Section = require("../models/Section");
const {
  notificationEmailTemplate,
} = require("../mail/templates/videoAvailable");
const mailSender = require("../utils/mailSender");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { Author, category, youtubePlaylistId, thumbnail, userId } = req.body;

    // Validate required fields
    if (!Author || !youtubePlaylistId || !category || !thumbnail || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Create a new course if not found
    const newCourse = await Course.create({
      Author,
      category,
      youtubePlaylistId,
      thumbnail,
      studentsEnrolled: [userId],
      discordLink: "",
    });

    // Create CourseProgress for the new course
    const courseProgress = await CourseProgress.create({
      userId,
      courseID: newCourse._id,
      completedVideos: [],
    });

    // Add course ID to the category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: {
            courseId: newCourse._id,
            enrollmentDate: new Date(),
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

exports.notifyUsers = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const sections = await Section.find({}).populate("courseId");

    for (const section of sections) {
      const users = await User.find({
        "courses.courseId": section.courseId._id,
      });

      for (const user of users) {
        // Find the specific course in the user's courses array
        const userCourse = user.courses.find((c) =>
          c.courseId.equals(section.courseId._id)
        );

        if (!userCourse) continue;

        const enrollmentDate = new Date(userCourse.enrollmentDate);
        const availableOn = new Date(enrollmentDate);
        availableOn.setDate(enrollmentDate.getDate() + section.releaseOffset);

        if (availableOn >= today && availableOn < tomorrow) {
          const subject = `New Section Available: ${section.title}`;

          const htmlContent = notificationEmailTemplate(
            `${user.firstName} ${user.lastName}`,
            `New Video: ${section.title}`,
            `We're excited to let you know that a new video titled "${section.title}" is now available. Head over to your course dashboard and continue learning!`,
            `https://skillstep.vercel.app/view-course/${section.courseId._id}/${section._id}`,
            "Go to Course"
          );

          // Send email notification to the user
          await mailSender(user.email, subject, htmlContent);
        }
      }
    }

    console.log("Email notifications processed successfully.");
  } catch (error) {
    console.error("Error notifying users:", error);
  }
};
