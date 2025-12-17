// src/services/videoService.ts
import { youtube } from "../clients/youtube.js";
import { VideoModel } from "../models/video.js";
import { Types } from "mongoose";
import { getYoutubeTranscript } from "./transcriptService.js";

export async function createVideoFromYoutube(projectId: string, ytVideoLink: string) {
  // Extract video ID from link
  const ytVideoIdMatch = ytVideoLink.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  let ytVideoId = ytVideoIdMatch?.[1];
  if (!ytVideoId) throw new Error("Invalid YouTube link");

  // Get video info
  const res = await youtube.videos.list({
    part: ["snippet", "statistics", "contentDetails"],
    id: [ytVideoId],
  });
  const video = res.data.items?.[0];
  if (!video) throw new Error("YouTube video not found");

  // Get transcript (official or fallback to audio)
  let transcript = "";
  try {
    transcript = await getYoutubeTranscript(ytVideoId);
  } catch (err) {
    console.error("Failed to get transcript:", err);
    transcript = "Transcript unavailable";
  }
  
  // Create video document
  const videoDoc = new VideoModel({
    projectId: new Types.ObjectId(projectId),
    ytVideoId: video.id!,
    ytChannelId: video.snippet?.channelId ?? "Unknown",
    title: video.snippet?.title ?? "No title",
    description: video.snippet?.description,
    transcript,
    duration: video.contentDetails?.duration ?? "PT0S", // YouTube duration format
    views: Number(video.statistics?.viewCount ?? 0),
  });

  return videoDoc.save();
}