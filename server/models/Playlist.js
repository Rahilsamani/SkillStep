const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  youtubePlaylistId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  channelTitle: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  totalVideos: {
    type: Number,
    default: 0,
  },
  isEnded: {
    type: Boolean,
    default: false,
  },
  videos: [
    {
      videoId: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, default: "" },
      thumbnail: { type: String, default: "" },
      position: { type: Number, required: true },
    },
  ],
  lastFetchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Playlist", playlistSchema);
