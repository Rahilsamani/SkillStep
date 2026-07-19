const express = require("express");
const router = express.Router();

const {
  createCourse,
  getFullCourseDetails,
  triggerNotifications,
} = require("../controllers/Course");
const {
  showAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/Category");
const { createSection } = require("../controllers/Section");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");
const { updateCourseProgress } = require("../controllers/courseProgress");
const { getProgressInsights } = require("../controllers/insightsController");

// Course Creation Route (Course)
router.post("/createCourse", auth, createCourse);
router.post("/addSection", auth, createSection);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
router.post("/getProgressInsights", auth, isStudent, getProgressInsights);
router.post("/triggerNotifications", auth, triggerNotifications);

router.post("/createCategory", auth, isAdmin, createCategory);
router.post("/updateCategory", auth, isAdmin, updateCategory);
router.post("/deleteCategory", auth, isAdmin, deleteCategory);
router.get("/showAllCategories", showAllCategories);

// Students Route (Rating And Review)
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
