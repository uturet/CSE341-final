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
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return {};

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      googleId: string;
      email: string;
    };

    return { user: decoded };
  } catch {
    return {};
  }
};
