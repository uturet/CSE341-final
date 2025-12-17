// src/graphql/resolvers/chatResolver.ts
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import mongoose from "mongoose";
import { ChatModel } from "../../models/chat.js";
import { ChatType } from "../types/chatType.js";
import { CreateChatInputType, UpdateChatInputType } from "../inputs/chatInput.js";
import { VideoModel } from "../../models/video.js";
import { chatWithVideo } from "../../services/chatService.js";
import type { IMessage } from "../../models/chat.js";

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const chatResolvers = {
  Query: {
    chat: {
      type: ChatType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid chat ID");
        return ChatModel.findById(id);
      },
    },
    chats: {
      type: new GraphQLList(ChatType),
      args: {
        projectId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_: any, { projectId, limit, skip }: { projectId?: string; limit?: number; skip?: number }) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId)) throw new Error("Invalid project ID");
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
        return ChatModel.find(filter).skip(skip ?? 0).limit(Math.min(limit ?? 50, 100));
      },
    },
  },

  Mutation: {
    createChat: {
      type: ChatType,
      args: { input: { type: new GraphQLNonNull(CreateChatInputType) } },
      resolve: async (_: any, { input }: any) => {
        const { projectId, videoId, title, messages } = input;

        if (!validateObjectId(projectId)) throw new Error("Invalid project ID");
        if (!videoId || !validateObjectId(videoId)) throw new Error("Invalid video ID");

        // Fetch video document
        const video = await VideoModel.findById(videoId);
        if (!video) throw new Error("Video not found");

        // Prepare initial messages (user input)
        const userMessageText = messages?.[0]?.text;
        if (!userMessageText) throw new Error("No user message provided");

        // Explicitly type as IMessage[]
        const chatMessages: IMessage[] = [
          { sender: "user", text: userMessageText }
        ];

        // AI response based on video transcript
        const aiAnswer = await chatWithVideo(video.transcript || "", chatMessages);
        chatMessages.push({ sender: "assistant", text: aiAnswer || ""});

        // Create chat document
        const chatDoc = new ChatModel({
          projectId: new mongoose.Types.ObjectId(projectId),
          videoId: new mongoose.Types.ObjectId(videoId),
          title: title || "New Chat",
          messages: chatMessages,
        });

        return chatDoc.save();
      },
    },

    updateChat: {
      type: ChatType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateChatInputType) },
      },
      resolve: async (_: any, { id, input }: { id: string; input: any }) => {
        if (!validateObjectId(id)) throw new Error("Invalid chat ID");

        const chat = await ChatModel.findById(id);
        if (!chat) throw new Error("Chat not found");

        const userMessageText = input.messages?.[0]?.text;
        if (!userMessageText) throw new Error("No user message provided");

        // Add user message
        chat.messages.push({ sender: "user", text: userMessageText });

        // Get AI response including all previous messages
        const videoTranscript = chat.videoId ? (await VideoModel.findById(chat.videoId))?.transcript || "" : "";
        const aiAnswer = await chatWithVideo(videoTranscript, [{ sender: "user", text: userMessageText }]);
        chat.messages.push({ sender: "assistant", text: aiAnswer || "" });

        await chat.save();
        return chat;
      },
    },

    deleteChat: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid chat ID");
        await ChatModel.findByIdAndDelete(id);
        return "Chat deleted";
      },
    },
  },
};