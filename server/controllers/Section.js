const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Properties" });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

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

const updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    if (!sectionName || !sectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Properties" });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    return res.status(200).json({
      success: true,
      data: course,
      message: "Section Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update Section, please try again",
      error: error.message,
    });
  }
};

// DELETE a section
const deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not Found" });
    }

    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createSection, updateSection, deleteSection };
