// src/graphql/resolvers/chatResolver.ts
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import mongoose from "mongoose";
import { ChatModel } from "../../models/chat";
import { ChatType } from "../types/chatType";
import { CreateChatInputType, UpdateChatInputType } from "../inputs/chatInput";

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
      resolve: async (
        _: any,
        {
          projectId,
          limit,
          skip,
        }: { projectId?: string; limit?: number; skip?: number }
      ) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId))
            throw new Error("Invalid project ID");
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
        const safeLimit = Math.min(limit ?? 50, 100);
        const safeSkip = skip ?? 0;
        return ChatModel.find(filter).skip(safeSkip).limit(safeLimit);
      },
    },
  },
  Mutation: {
    createChat: {
      type: ChatType,
      args: { input: { type: new GraphQLNonNull(CreateChatInputType) } },
      resolve: async (_: any, { input }: any) => {
        if (!validateObjectId(input.projectId))
          throw new Error("Invalid project ID");
        return ChatModel.create({
          ...input,
          projectId: new mongoose.Types.ObjectId(input.projectId),
          messages: input.messages || [],
        });
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
        return ChatModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
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
