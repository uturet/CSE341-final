// src/graphql/context.ts
import type { Request } from "express";
import jwt from "jsonwebtoken";

export interface GraphQLContext {
  user?: {
    googleId: string;
    email: string;
  };
}

export const buildContext = (req: Request): GraphQLContext => {
  const context: GraphQLContext = {};

  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        googleId: string;
        email: string;
      };
      
      context.user = decoded;
    }
  } catch (error) {
    // Invalid token, context.user remains undefined
    console.log("Invalid or expired token");
  }

  return context;
};