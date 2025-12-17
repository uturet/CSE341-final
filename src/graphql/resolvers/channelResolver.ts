// src/graphql/resolvers/channelResolver.ts
import mongoose from "mongoose";
import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import { ChannelModel } from "../../models/channel.js";
import { ProjectModel } from "../../models/project.js";
import { UserModel } from "../../models/user.js";
import { ChannelType } from "../types/channelType.js";
import { CreateChannelInputType, UpdateChannelInputType } from "../inputs/channelInput.js";
import { requireAuth } from "../helpers/auth.js";
import type { GraphQLContext } from "../context.js";

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

export const channelResolvers = {
  Query: {
    channel: {
      type: ChannelType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid channel ID");
        
        const channel = await ChannelModel.findById(id);
        if (!channel) throw new Error("Channel not found");
        
        // Verify user owns the project this channel belongs to
        await verifyProjectOwnership(channel.projectId.toString(), user.googleId);
        
        return channel;
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
        { projectId, limit, skip }: { projectId?: string; limit?: number; skip?: number },
        context: GraphQLContext
      ) => {
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
      resolve: async (_: any, { input }: any, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(input.projectId)) throw new Error("Invalid project ID");
        
        // Verify user owns the project
        await verifyProjectOwnership(input.projectId, user.googleId);
        
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
      resolve: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid channel ID");
        
        const channel = await ChannelModel.findById(id);
        if (!channel) throw new Error("Channel not found");
        
        // Verify user owns the project this channel belongs to
        await verifyProjectOwnership(channel.projectId.toString(), user.googleId);
        
        if (input.projectId && !validateObjectId(input.projectId)) {
          throw new Error("Invalid project ID");
        }
        
        const update = { ...input };
        if (input.projectId) {
          // If changing project, verify user owns the new project too
          await verifyProjectOwnership(input.projectId, user.googleId);
          update.projectId = new mongoose.Types.ObjectId(input.projectId);
        }
        
        return ChannelModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      },
    },
    deleteChannel: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid channel ID");
        
        const channel = await ChannelModel.findById(id);
        if (!channel) throw new Error("Channel not found");
        
        // Verify user owns the project this channel belongs to
        await verifyProjectOwnership(channel.projectId.toString(), user.googleId);
        
        await ChannelModel.findByIdAndDelete(id);
        return "Channel deleted";
      },
    },
  },
};