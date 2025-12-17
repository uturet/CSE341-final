// src/graphql/resolvers/userResolver.ts
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.js";
import { UserType } from "../types/userType.js";
import {
  CreateUserInputType,
  UpdateUserInputType,
} from "../inputs/userInput.js";
import { requireAuth } from "../helpers/auth.js";
import type { GraphQLContext } from "../context.js";

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const userResolvers = {
  Query: {
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid user ID");
        
        const requestedUser = await UserModel.findById(id);
        if (!requestedUser) throw new Error("User not found");
        
        // Users can only view their own profile
        if (requestedUser.googleId !== user.googleId) {
          throw new Error("You can only view your own profile");
        }
        
        return requestedUser;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (
        _: any,
        { limit, skip }: { limit: number; skip: number },
        context: GraphQLContext
      ) => {
        // Require authentication (admin only - you may want to restrict this further)
        const user = requireAuth(context);
        
        // For now, users can only query themselves
        const authenticatedUser = await UserModel.findOne({ googleId: user.googleId });
        if (!authenticatedUser) throw new Error("User not found");
        
        // Return only the authenticated user
        return [authenticatedUser];
        
        // If you want to allow listing all users (e.g., for admins), uncomment:
        // return UserModel.find().skip(skip).limit(Math.min(limit, 100));
      },
    },
  },

  Mutation: {
    createUser: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (
        _: any,
        { input }: { input: { googleId: string; email: string; name?: string } }
      ) => {
        // NOTE: This should only be called via OAuth flow or by system
        // In production, you may want to restrict this further
        return UserModel.create(input);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateUserInputType) },
      },
      resolve: async (
        _: any,
        { id, input }: { id: string; input: { email?: string; name?: string } },
        context: GraphQLContext
      ) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid user ID");
        
        const targetUser = await UserModel.findById(id);
        if (!targetUser) throw new Error("User not found");
        
        // Users can only update their own profile
        if (targetUser.googleId !== user.googleId) {
          throw new Error("You can only update your own profile");
        }
        
        return UserModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        // Require authentication
        const user = requireAuth(context);
        
        if (!validateObjectId(id)) throw new Error("Invalid user ID");
        
        const targetUser = await UserModel.findById(id);
        if (!targetUser) throw new Error("User not found");
        
        // Users can only delete their own account
        if (targetUser.googleId !== user.googleId) {
          throw new Error("You can only delete your own account");
        }
        
        await UserModel.findByIdAndDelete(id);
        return "User deleted";
      },
    },
  },
};