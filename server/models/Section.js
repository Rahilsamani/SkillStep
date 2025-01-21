const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  videoId: {
    type: String,
  },
  releaseOffset: {
    type: Number,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  usersNotified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Section", sectionSchema);
