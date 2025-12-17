// src/models/chat.ts
import { Schema, model, Types } from "mongoose";

export interface IMessage {
  sender: "user" | "assistant";
  text: string;
}

export interface IChat {
  projectId: Types.ObjectId;
  videoId?: Types.ObjectId;
  title?: string;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const ChatSchema = new Schema<IChat>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    videoId: { type: Schema.Types.ObjectId, ref: "Video" },
    title: { type: String },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const ChatModel = model<IChat>("Chat", ChatSchema, "chats");
