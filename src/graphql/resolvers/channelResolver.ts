// src/graphql/resolvers/channelResolver.ts
import mongoose from "mongoose";
import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import { ChannelModel } from "../../models/channel.js";
import { ChannelType } from "../types/channelType.js";
import { CreateChannelInputType, UpdateChannelInputType } from "../inputs/channelInput.js";


// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const channelResolvers = {
  Query: {
    channel: {
      type: ChannelType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid channel ID");
        return ChannelModel.findById(id);
      },
    },
    channels: {
      type: new GraphQLList(ChannelType),
      args: {
        projectId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (
        _: any,
        { projectId, limit, skip }: { projectId?: string; limit?: number; skip?: number }
      ) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId)) throw new Error("Invalid project ID");
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
        const safeLimit = Math.min(limit ?? 50, 100);
        const safeSkip = skip ?? 0;
        return ChannelModel.find(filter).skip(safeSkip).limit(safeLimit);
      },
    },
  },

  Mutation: {
    createChannel: {
      type: ChannelType,
      args: { input: { type: new GraphQLNonNull(CreateChannelInputType) } },
      resolve: async (_: any, { input }: any) => {
        if (!validateObjectId(input.projectId)) throw new Error("Invalid project ID");
        return ChannelModel.create({
          ...input,
          projectId: new mongoose.Types.ObjectId(input.projectId),
        });
      },
    },
    updateChannel: {
      type: ChannelType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateChannelInputType) },
      },
      resolve: async (_: any, { id, input }: { id: string; input: any }) => {
        if (!validateObjectId(id)) throw new Error("Invalid channel ID");
        if (input.projectId && !validateObjectId(input.projectId)) {
          throw new Error("Invalid project ID");
        }
        const update = { ...input };
        if (input.projectId) update.projectId = new mongoose.Types.ObjectId(input.projectId);
        return ChannelModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      },
    },
    deleteChannel: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid channel ID");
        await ChannelModel.findByIdAndDelete(id);
        return "Channel deleted";
      },
    },
  },
};