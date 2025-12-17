// src/graphql/resolvers/videoResolver.ts (CORRECTED for your structure)
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import mongoose from "mongoose";
import { VideoModel } from "../../models/video.js";
import { ProjectModel } from "../../models/project.js";
import { UserModel } from "../../models/user.js";
import { VideoType } from "../types/videoType.js";
import {
  CreateVideoInputType,
  UpdateVideoInputType,
} from "../inputs/videoInput.js";
import { createVideoFromYoutube } from "../../services/videoService.js"; // CORRECTED: no youtube folder
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

export const videoResolvers = {
  Query: {
    video: {
      type: VideoType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid video ID");
        
        const video = await VideoModel.findById(id);
        if (!video) throw new Error("Video not found");
        
        // Verify user owns the project this video belongs to
        await verifyProjectOwnership(video.projectId.toString(), user.googleId);
        
        return video;
      },
    },
    videos: {
      type: new GraphQLList(VideoType),
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
        }: { projectId?: string; limit?: number; skip?: number },
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
        
        return VideoModel.find(filter)
          .skip(skip ?? 0)
          .limit(Math.min(limit ?? 50, 100));
      },
    },
  },

  Mutation: {
    createVideo: {
      type: VideoType,
      args: { input: { type: new GraphQLNonNull(CreateVideoInputType) } },
      resolve: async (_: any, { input }: any, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        const { projectId, ytVideoLink } = input;
        
        if (!validateObjectId(projectId)) throw new Error("Invalid project ID");
        
        // Verify user owns the project
        await verifyProjectOwnership(projectId, user.googleId);
        
        return createVideoFromYoutube(projectId, ytVideoLink);
      },
    },
    updateVideo: {
      type: VideoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateVideoInputType) },
      },
      resolve: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid video ID");
        
        const video = await VideoModel.findById(id);
        if (!video) throw new Error("Video not found");
        
        // Verify user owns the project this video belongs to
        await verifyProjectOwnership(video.projectId.toString(), user.googleId);
        
        return VideoModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },
    deleteVideo: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid video ID");
        
        const video = await VideoModel.findById(id);
        if (!video) throw new Error("Video not found");
        
        // Verify user owns the project this video belongs to
        await verifyProjectOwnership(video.projectId.toString(), user.googleId);
        
        await VideoModel.findByIdAndDelete(id);
        return "Video deleted";
      },
    },
  },
};