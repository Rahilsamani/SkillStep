const Course = require("../models/Course");
const User = require("../models/User");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress");
const { sendCertificate } = require("../utils/sendCertificate");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, sectionId } = req.body;
  const userId = req.user.id;

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid section" });
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist",
      });
    }

    if (courseProgress.completedVideos.includes(sectionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Section already completed" });
    }

    courseProgress.completedVideos.push(sectionId);
    courseProgress.completionLog.push({
      sectionId: sectionId,
      completedAt: new Date(),
    });
    await courseProgress.save();

    const allSections = await Section.find({ courseId });
    const completedSectionIds = courseProgress.completedVideos;

    if (
      allSections.length > 0 &&
      allSections.length === completedSectionIds.length
    ) {
      const user = await User.findById(userId);
      const userCourse = user.courses.find((c) => c.courseId.equals(courseId));

      if (userCourse) {
        userCourse.completed = true;
        userCourse.completionDate = new Date();
        await user.save();

        // Trigger certificate generation
        processCertificate(user, courseId);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const processCertificate = async (user, courseId) => {
  try {
    const course = await Course.findById(courseId);
    const userCourse = user.courses.find((c) => c.courseId.equals(courseId));

    if (course && userCourse) {
      await sendCertificate(user, course, userCourse);
    }
  } catch (error) {
    console.error("Error in certificate processing:", error.message);
  }
};
