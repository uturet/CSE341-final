// src/models/video.ts
import { Schema, model, Types } from "mongoose";

export interface IVideo {
  projectId: Types.ObjectId;
  title: string;
  ytChannelId: string;
  ytVideoId: string;
  description?: string;
  transcript?: string;
  duration: string;
  views: number;
}

const VideoSchema = new Schema<IVideo>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: { type: String, required: true },
    ytChannelId: { type: String, required: true },
    ytVideoId: {
      type: String,
      required: true,
    },
    description: { type: String },
    transcript: { type: String },
    duration: { type: String, required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const VideoModel = model<IVideo>("Video", VideoSchema, "videos");
