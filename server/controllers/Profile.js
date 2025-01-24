const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id, { firstName, lastName });

    await user.save();

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    await profile.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    });

    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      );
    }

    await User.findByIdAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

    await CourseProgress.deleteMany({ userId: id });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses.courseId",
        populate: {
          path: "courseContent",
          model: "Section",
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId)
      .populate({
        path: "courses.courseId",
      })
      .populate({
        path: "courseProgress",
        populate: { path: "completedVideos" },
      })
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with ID: ${userId}`,
      });
    }

    const coursesWithProgress = userDetails.courses.map((course) => {
      const courseProgress = userDetails.courseProgress.find(
        (progress) =>
          progress.courseID.toString() === course.courseId._id.toString()
      );

      const completedLectures = courseProgress?.completedVideos.length;
      const totalLectures = course.courseId.courseContent.length;

      if (totalLectures === 0) return 0;

      const progress = Math.round((completedLectures / totalLectures) * 100);

      return {
        courseId: course._id,
        progress,
      };
    });

    return res.status(200).json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    console.error("Error calculating course progress:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course progress",
    });
  }
};
