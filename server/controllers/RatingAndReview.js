const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// Create Rating and Review for a Course
const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // Check if the user is enrolled in the course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this course.",
      });
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Update the course with the new rating and review
    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingReview._id },
    });

    return res.status(200).json({
      success: true,
      message: "Thank you for your review!",
      ratingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting your review.",
      error: error.message,
    });
  }
};

// Get Average Rating for a Course
const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      message: "No ratings yet for this course.",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the average rating.",
      error: error.message,
    });
  }
};

// Get All Reviews
const getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate("user", "firstName lastName email image")
      .populate("course", "courseName")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully.",
      data: allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the reviews.",
      error: error.message,
    });
  }
};

module.exports = { createRating, getAverageRating, getAllRating };
