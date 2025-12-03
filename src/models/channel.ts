// src/models/channel.ts
import { Schema, model, Types } from "mongoose";

export interface IChannel {
  projectId: Types.ObjectId;
  name?: string;
  ytChannelId: string;
}

const ChannelSchema = new Schema<IChannel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String },
    ytChannelId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ChannelModel = model<IChannel>("Channel", ChannelSchema, "channels");
