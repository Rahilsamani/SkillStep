const Section = require("../models/Section");
const Course = require("../models/Course");

const createSection = async (req, res) => {
  try {
    const { title, description, thumbnail, videoId, courseId, availableOn } =
      req.body;

    if (!title || !courseId || !availableOn) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties (title, courseId, availableOn)",
      });
    }

    const newSection = await Section.create({
      title,
      description,
      thumbnail,
      videoId,
      availableOn,
    });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create Section, please try again",
      error: error.message,
    });
  }
};

module.exports = { createSection };
