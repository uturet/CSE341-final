// src/graphql/resolvers/authResolver.ts
import { GraphQLNonNull, GraphQLString } from "graphql";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.js";
import { AuthPayloadType } from "../types/authType.js";
import { GoogleAuthInputType } from "../inputs/authInput.js";
import { generateToken } from "../../auth/jwt.js";

export const authResolvers = {
  Query: {
    // Verify and decode JWT token
    verifyToken: {
      type: AuthPayloadType,
      args: { token: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_: any, { token }: { token: string }) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const user = await UserModel.findOne({ googleId: decoded.googleId });

          if (!user) {
            return {
              success: false,
              message: "User not found"
            };
          }

          return {
            success: true,
            user,
            token,
            message: "Token is valid"
          };
        } catch (error) {
          return {
            success: false,
            message: "Invalid or expired token"
          };
        }
      }
    },

    // Get current user from context (requires authentication middleware)
    me: {
      type: AuthPayloadType,
      resolve: async (_: any, __: any, context: any) => {
        if (!context.user) {
          return {
            success: false,
            message: "Not authenticated"
          };
        }

        const user = await UserModel.findOne({ googleId: context.user.googleId });

        if (!user) {
          return {
            success: false,
            message: "User not found"
          };
        }

        return {
          success: true,
          user,
          message: "Authenticated"
        };
      }
    }
  },

  Mutation: {
    // Google OAuth login/signup
    googleAuth: {
      type: AuthPayloadType,
      args: { input: { type: new GraphQLNonNull(GoogleAuthInputType) } },
      resolve: async (_: any, { input }: any) => {
        try {
          let user = await UserModel.findOne({ googleId: input.googleId });

          if (!user) {
            // Create new user if doesn't exist
            user = await UserModel.create({
              googleId: input.googleId,
              email: input.email,
              name: input.name
            });
          } else {
            // Update existing user info if needed
            if (input.name && user.name !== input.name) {
              user.name = input.name;
              await user.save();
            }
          }

          const token = generateToken(user);

          return {
            success: true,
            token,
            user,
            message: "Authentication successful"
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : "Authentication failed"
          };
        }
      }
    },

    // Refresh token
    refreshToken: {
      type: AuthPayloadType,
      args: { token: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_: any, { token }: { token: string }) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const user = await UserModel.findOne({ googleId: decoded.googleId });

          if (!user) {
            return {
              success: false,
              message: "User not found"
            };
          }

          // Generate new token
          const newToken = generateToken(user);

          return {
            success: true,
            token: newToken,
            user,
            message: "Token refreshed successfully"
          };
        } catch (error) {
          return {
            success: false,
            message: "Invalid or expired token"
          };
        }
      }
    }
  }
};