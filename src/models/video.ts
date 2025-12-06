// src/models/video.ts
import { Schema, model, Types } from "mongoose";

export interface IVideo {
  projectId: Types.ObjectId;
  title?: string;
  ytChannelId: string;
  ytVideoId: string;
  description?: string;
  captions?: string;
  length?: number;
  views?: number;
}

const VideoSchema = new Schema<IVideo>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: { type: String },
    ytChannelId: { type: String },
    ytVideoId: {
      type: String,
      required: true,
    },
    description: { type: String },
    captions: { type: String },
    length: { type: Number },
    views: { type: Number },
  },
  { timestamps: true }
);

export const VideoModel = model<IVideo>("Video", VideoSchema, "videos");
