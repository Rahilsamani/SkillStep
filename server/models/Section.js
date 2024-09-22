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
});

module.exports = mongoose.model("Section", sectionSchema);
