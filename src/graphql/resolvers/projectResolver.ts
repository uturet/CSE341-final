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
import { UserModel } from "../../models/user.js";
import { ProjectType } from "../types/projectType.js";
import {
  CreateProjectInputType,
  UpdateProjectInputType,
} from "../inputs/projectInput.js";
import { requireAuth } from "../helpers/auth.js";
import type { GraphQLContext } from "../context.js";

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const projectResolvers = {
  Query: {
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid project ID");
        
        const project = await ProjectModel.findById(id);
        if (!project) throw new Error("Project not found");
        
        // Authorization: Check if user owns this project
        const projectOwner = await UserModel.findById(project.userId);
        if (!projectOwner || projectOwner.googleId !== user.googleId) {
          throw new Error("You do not have permission to access this project");
        }
        
        return project;
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
        }: { userId?: string; limit?: number; skip?: number },
        context: GraphQLContext
      ) => {
        // Require authentication
        const user = requireAuth(context);
        
        // If userId is provided, verify it matches the authenticated user
        if (userId) {
          if (!validateObjectId(userId)) throw new Error("Invalid user ID");
          
          const requestedUser = await UserModel.findById(userId);
          if (!requestedUser || requestedUser.googleId !== user.googleId) {
            throw new Error("You can only view your own projects");
          }
        }
        
        // Get authenticated user's ID
        const authenticatedUser = await UserModel.findOne({ googleId: user.googleId });
        if (!authenticatedUser) throw new Error("User not found");
        
        const filter: any = {
          userId: authenticatedUser._id
        };

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
      resolve: async (_: any, { input }: any, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(input.userId)) throw new Error("Invalid user ID");
        
        // Verify the user can only create projects for themselves
        const targetUser = await UserModel.findById(input.userId);
        if (!targetUser || targetUser.googleId !== user.googleId) {
          throw new Error("You can only create projects for yourself");
        }
        
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
      },
      resolve: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid project ID");
        
        const project = await ProjectModel.findById(id);
        if (!project) throw new Error("Project not found");
        
        // Authorization: Check if user owns this project
        const projectOwner = await UserModel.findById(project.userId);
        if (!projectOwner || projectOwner.googleId !== user.googleId) {
          throw new Error("You do not have permission to update this project");
        }
        
        return ProjectModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },
    deleteProject: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid project ID");
        
        const project = await ProjectModel.findById(id);
        if (!project) throw new Error("Project not found");
        
        // Authorization: Check if user owns this project
        const projectOwner = await UserModel.findById(project.userId);
        if (!projectOwner || projectOwner.googleId !== user.googleId) {
          throw new Error("You do not have permission to delete this project");
        }
        
        await ProjectModel.findByIdAndDelete(id);
        return "Project deleted";
      },
    },
  },
};