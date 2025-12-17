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
import { VideoModel } from "../../models/video.js";
import { ProjectModel } from "../../models/project.js";
import { UserModel } from "../../models/user.js";
import { ChatType } from "../types/chatType.js";
import { CreateChatInputType, UpdateChatInputType } from "../inputs/chatInput.js";
import { chatWithVideo } from "../../services/chatService.js";
import { requireAuth } from "../helpers/auth.js";
import type { GraphQLContext } from "../context.js";
import type { IMessage } from "../../models/chat.js";

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

// Helper: verify user owns the project
async function verifyProjectOwnership(projectId: string, userGoogleId: string) {
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new Error("Project not found");
  
  const projectOwner = await UserModel.findById(project.userId);
  if (!projectOwner || projectOwner.googleId !== userGoogleId) {
    throw new Error("You do not have permission to access this project");
  }
  
  return project;
}

export const chatResolvers = {
  Query: {
    chat: {
      type: ChatType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid chat ID");
        
        const chat = await ChatModel.findById(id);
        if (!chat) throw new Error("Chat not found");
        
        // Verify user owns the project this chat belongs to
        await verifyProjectOwnership(chat.projectId.toString(), user.googleId);
        
        return chat;
      },
    },
    chats: {
      type: new GraphQLList(ChatType),
      args: {
        projectId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_: any, { projectId, limit, skip }: { projectId?: string; limit?: number; skip?: number }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!projectId) {
          throw new Error("projectId is required");
        }
        
        if (!validateObjectId(projectId)) {
          throw new Error("Invalid project ID");
        }
        
        // Verify user owns the project
        await verifyProjectOwnership(projectId, user.googleId);
        
        const filter: any = {
          projectId: new mongoose.Types.ObjectId(projectId)
        };
        
        return ChatModel.find(filter).skip(skip ?? 0).limit(Math.min(limit ?? 50, 100));
      },
    },
  },

  Mutation: {
    createChat: {
      type: ChatType,
      args: { input: { type: new GraphQLNonNull(CreateChatInputType) } },
      resolve: async (_: any, { input }: any, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        const { projectId, videoId, title, messages } = input;

        if (!validateObjectId(projectId)) throw new Error("Invalid project ID");
        if (!videoId || !validateObjectId(videoId)) throw new Error("Invalid video ID");

        // Verify user owns the project
        await verifyProjectOwnership(projectId, user.googleId);

        // Fetch video document and verify it belongs to the same project
        const video = await VideoModel.findById(videoId);
        if (!video) throw new Error("Video not found");
        
        if (video.projectId.toString() !== projectId) {
          throw new Error("Video does not belong to this project");
        }

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
      resolve: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid chat ID");
        
        const chat = await ChatModel.findById(id);
        if (!chat) throw new Error("Chat not found");
        
        // Verify user owns the project this chat belongs to
        await verifyProjectOwnership(chat.projectId.toString(), user.googleId);
        
        return ChatModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },

    deleteChat: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid chat ID");
        
        const chat = await ChatModel.findById(id);
        if (!chat) throw new Error("Chat not found");
        
        // Verify user owns the project this chat belongs to
        await verifyProjectOwnership(chat.projectId.toString(), user.googleId);
        
        await ChatModel.findByIdAndDelete(id);
        return "Chat deleted";
      },
    },
  },
};