const express = require("express");
const router = express.Router();

const { createCourse, getFullCourseDetails } = require("../controllers/Course");
const {
  showAllCategories,
  createCategory,
} = require("../controllers/Category");
const { createSection } = require("../controllers/Section");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");
const { updateCourseProgress } = require("../controllers/courseProgress");

// Course Creation Route (Course)
router.post("/createCourse", auth, createCourse);
router.post("/addSection", auth, createSection);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Admin Routes (Category)
router.post("/createCategory", auth, createCategory);
router.get("/showAllCategories", showAllCategories);

// Students Route (Rating And Review)
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
