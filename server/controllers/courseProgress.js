const { generateCertificate } = require("../utils/generateCerificate");
const mailSender = require("../utils/mailSender");
const Course = require("../models/Course");
const User = require("../models/User");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress");
const { uploadPdfToCloudinary } = require("../utils/imageUploader");
const certificate = require("../mail/templates/certificate");

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

        const course = await Course.findById(courseId);

        // Generate the certificate as a buffer
        const certificateBuffer = await generateCertificate(user, course);

        // Upload the PDF to Cloudinary
        const uploadResponse = await uploadPdfToCloudinary(
          certificateBuffer,
          "certificates",
          `${user.firstName}_${user.lastName}_${course.title}_Certificate`
        );

        const certificateUrl = uploadResponse.secure_url;

        // Send email
        const title = `Your Certificate of Completion for ${course.Author}`;
        const body = certificate(
          user.firstName,
          user.lastName,
          course.Author,
          course.enrollmentDate,
          userCourse.completionDate
        );
        await mailSender(user.email, title, body);

        userCourse.certificateIssued = true;
        userCourse.certificateUrl = certificateUrl;
        await user.save();
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
