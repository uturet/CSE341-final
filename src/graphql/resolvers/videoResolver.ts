// src/graphql/resolvers/videoResolver.ts
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import mongoose from "mongoose";
import { VideoModel } from "../../models/video.js";
import { VideoType } from "../types/videoType.js";
import {
  CreateVideoInputType,
  UpdateVideoInputType,
} from "../inputs/videoInput";
import { createVideoFromYoutube } from "../../services/videoService";

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const videoResolvers = {
  Query: {
    video: {
      type: VideoType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid video ID");
        return VideoModel.findById(id);
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
        }: { projectId?: string; limit?: number; skip?: number }
      ) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId))
            throw new Error("Invalid project ID");
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
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
      resolve: async (_: any, { input }: any) => {
        const { projectId, ytVideoLink } = input;
        if (!validateObjectId(projectId)) throw new Error("Invalid project ID");
        return createVideoFromYoutube(projectId, ytVideoLink);
      },
    },
    updateVideo: {
      type: VideoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateVideoInputType) },
      },
      resolve: async (_: any, { id, input }: { id: string; input: any }) => {
        if (!validateObjectId(id)) throw new Error("Invalid video ID");
        return VideoModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },
    deleteVideo: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid video ID");
        await VideoModel.findByIdAndDelete(id);
        return "Video deleted";
      },
    },
  },
};
