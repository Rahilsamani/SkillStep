const Playlist = require("../models/Playlist");
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Fetch all items from a YouTube playlist using paginated API calls.
 * @param {string} playlistId - The YouTube playlist ID
 * @returns {Array} Array of video items with extracted fields
 */
async function fetchPlaylistFromYouTube(playlistId) {
  const allItems = [];
  let nextPageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=50${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `YouTube API error: ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (data.items) {
      for (const item of data.items) {
        const snippet = item.snippet;
        if (!snippet || !snippet.resourceId) continue;

        allItems.push({
          videoId: snippet.resourceId.videoId,
          title: snippet.title,
          description: snippet.description || "",
          thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
          position: snippet.position,
          channelTitle: snippet.videoOwnerChannelTitle || "",
          playlistThumbnail: snippet.thumbnails?.default?.url || "",
        });
      }
    }

    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);

  return allItems;
}

/**
 * Get playlist data — from cache if ended, otherwise re-fetch from YouTube.
 * Creates or updates the Playlist cache document.
 *
 * @param {string} playlistId - The YouTube playlist ID
 * @param {boolean} isEnded - Whether the playlist is finalized (no new videos expected)
 * @returns {Object} { playlist, videos, channelTitle, thumbnail }
 */
async function getOrFetchPlaylist(playlistId, isEnded = false) {
  // Check if we already have this playlist cached
  const cachedPlaylist = await Playlist.findOne({ youtubePlaylistId: playlistId });

  // If cached AND marked as ended, return cache directly — no YouTube call
  if (cachedPlaylist && cachedPlaylist.isEnded) {
    return {
      playlist: cachedPlaylist,
      videos: cachedPlaylist.videos,
      channelTitle: cachedPlaylist.channelTitle,
      thumbnail: cachedPlaylist.thumbnail,
      fromCache: true,
    };
  }

  // Otherwise, fetch fresh data from YouTube
  const items = await fetchPlaylistFromYouTube(playlistId);

  if (!items || items.length === 0) {
    throw new Error("No videos found in the playlist");
  }

  // Extract metadata from the first item
  const channelTitle = items[0].channelTitle;
  const thumbnail = items[0].playlistThumbnail;

  // Prepare video data for storage (strip helper fields)
  const videos = items.map((item) => ({
    videoId: item.videoId,
    title: item.title,
    description: item.description,
    thumbnail: item.thumbnail,
    position: item.position,
  }));

  // Upsert the Playlist cache
  const playlist = await Playlist.findOneAndUpdate(
    { youtubePlaylistId: playlistId },
    {
      youtubePlaylistId: playlistId,
      channelTitle,
      thumbnail,
      totalVideos: videos.length,
      isEnded: isEnded,
      videos,
      lastFetchedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return {
    playlist,
    videos,
    channelTitle,
    thumbnail,
    fromCache: false,
  };
}

module.exports = { getOrFetchPlaylist, fetchPlaylistFromYouTube };
