// src/services/youtubeService.ts
import { google } from "googleapis";

if (!process.env.YOUTUBE_API_KEY) {
  throw new Error("YOUTUBE_API_KEY is not set");
}

export const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});