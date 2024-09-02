const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      youtubeVideoIds,
      instructions,
    } = req.body;

    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category ||
      !instructions
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: JSON.parse(tag),
      category: categoryDetails._id,
      youtubeVideoIds: JSON.parse(youtubeVideoIds),
      thumbnail: thumbnailImage.secure_url,
      status: status || "Draft",
      instructions: JSON.parse(instructions),
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      { _id: category },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

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

// Edit a course
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;

    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      updates.thumbnail = thumbnailImage.secure_url;
    }

    const course = await Course.findByIdAndUpdate({ _id: courseId }, updates, {
      new: true,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Error occurred while updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// Fetch all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

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
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
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
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
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

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with id: ${courseId} does not exist`,
      });
    }

    await User.findByIdAndUpdate(
      { _id: course.instructor },
      { $pull: { courses: courseId } }
    );
    await Category.findByIdAndUpdate(
      { _id: course.category },
      { $pull: { courses: courseId } }
    );

    await Course.findByIdAndDelete({ _id: courseId });

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error occurred while deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
