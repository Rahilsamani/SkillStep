const Course = require("../models/Course");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");

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

    // Check if course already exists
    let course = await Course.findOne({ youtubePlaylistId });

    // Function to handle course progress and user enrollment
    const handleCourseProgressAndUser = async (course) => {
      if (!course.studentsEnrolled.includes(userId)) {
        course.studentsEnrolled.push(userId);
        await course.save();
      }

      // Ensure the course is added to the user's courses if not already present
      const user = await User.findById(userId);
      if (!user.courses.includes(course._id)) {
        user.courses.push(course._id);
        await user.save();
      }

      // Create CourseProgress if not already created
      let courseProgress = await CourseProgress.findOne({
        userId,
        courseID: course._id,
      });
      course.courseProgress = courseProgress;
      course.save();

      if (!courseProgress) {
        courseProgress = await CourseProgress.create({
          userId,
          courseID: course._id,
          completedVideos: [],
        });
      }

      return courseProgress;
    };

    if (course) {
      // Course exists, handle progress and enrollment
      const courseProgress = await handleCourseProgressAndUser(course);
      return res.status(200).json({
        success: true,
        data: course,
        message: "Course already exists and user enrolled successfully",
        exist: true,
      });
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
        $push: { courses: newCourse._id, courseProgress: courseProgress._id },
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
