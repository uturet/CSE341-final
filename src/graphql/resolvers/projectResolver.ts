// src/graphql/resolvers/projectResolver.ts
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import mongoose from "mongoose";
import { ProjectModel } from "../../models/project.js";
import { ProjectType } from "../types/projectType.js";
import {
  CreateProjectInputType,
  UpdateProjectInputType,
} from "../inputs/projectInput.js";

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const projectResolvers = {
  Query: {
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid project ID");
        return ProjectModel.findById(id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      args: {
        userId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (
        _: any,
        {
          userId,
          limit,
          skip,
        }: { userId?: string; limit?: number; skip?: number }
      ) => {
        const filter: any = {};
        if (userId) {
          if (!validateObjectId(userId)) throw new Error("Invalid user ID");
          filter.userId = new mongoose.Types.ObjectId(userId);
        }

        const safeLimit = Math.min(limit ?? 50, 100);
        const safeSkip = skip ?? 0;

        return ProjectModel.find(filter).skip(safeSkip).limit(safeLimit);
      },
    },
  },
  Mutation: {
    createProject: {
      type: ProjectType,
      args: { input: { type: new GraphQLNonNull(CreateProjectInputType) } },
      resolve: async (_: any, { input }: any) => {
        if (!validateObjectId(input.userId)) throw new Error("Invalid user ID");
        return ProjectModel.create({
          ...input,
          userId: new mongoose.Types.ObjectId(input.userId),
        });
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateProjectInputType) },
      }, // import UpdateProjectInputType
      resolve: async (_: any, { id, input }: { id: string; input: any }) => {
        if (!validateObjectId(id)) throw new Error("Invalid project ID");
        return ProjectModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },
    deleteProject: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid project ID");
        await ProjectModel.findByIdAndDelete(id);
        return "Project deleted";
      },
    },
  },
};
