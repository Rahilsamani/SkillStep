const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  targetVideosPerDay: {
    type: Number,
    default: 1,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  completionLog: [
    {
      sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
