const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  videoId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SubSection", subSectionSchema);
