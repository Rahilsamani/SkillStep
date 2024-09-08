const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getFullCourseDetails,
} = require("../controllers/Course");
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");
const { createSection } = require("../controllers/Section");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");
const { updateCourseProgress } = require("../controllers/courseProgress");

// Instructor Route (Course)
router.post("/createCourse", auth, createCourse);
router.post("/addSection", auth, createSection);
router.get("/getAllCourses", getAllCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Admin Routes (Category)
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// Students Route (Rating And Review)
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
