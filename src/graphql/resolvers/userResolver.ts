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

// Helper: validate MongoDB ObjectId
function validateObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export const userResolvers = {
  Query: {
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid user ID");
        return UserModel.findById(id);
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
        { limit, skip }: { limit: number; skip: number }
      ) => {
        return UserModel.find().skip(skip).limit(Math.min(limit, 100));
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
        { id, input }: { id: string; input: { email?: string; name?: string } }
      ) => {
        if (!validateObjectId(id)) throw new Error("Invalid user ID");
        return UserModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: { id: string }) => {
        if (!validateObjectId(id)) throw new Error("Invalid user ID");
        await UserModel.findByIdAndDelete(id);
        return "User deleted";
      },
    },
  },
};
