const Course = require("../models/Course");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const {
      Author,
      category,
      youtubePlaylistId,
      thumbnail,
      userId,
      courseSections,
    } = req.body;

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

    // Create a new course
    const newCourse = await Course.create({
      Author,
      category,
      youtubePlaylistId,
      thumbnail,
      studentsEnrolled: [userId],
    });

    console.log("Course Sections -> ", courseSections[0]);

    // Add course ID to the category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Add course ID to user's courses
    await User.findByIdAndUpdate(
      userId,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Respond with success
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course created successfully",
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

// Fetch all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({});

    res.status(200).json({
      success: true,
      data: allCourses,
      message: "Fetched all courses successfully",
    });
  } catch (error) {
    console.error("Error occurred while fetching all courses:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch course details",
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
