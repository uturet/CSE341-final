// src/graphql/helpers/auth.ts
import { GraphQLError } from "graphql";
import type { GraphQLContext } from "../context.js";

/**
 * Ensures the user is authenticated. Throws an error if not.
 */
export function requireAuth(context: GraphQLContext) {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.user;
}

/**
 * Ensures the user is authenticated and owns the resource.
 * @param context - GraphQL context
 * @param resourceUserId - The user ID of the resource owner
 */
export function requireOwnership(context: GraphQLContext, resourceUserId: string) {
  const user = requireAuth(context);
  
  if (user.googleId !== resourceUserId) {
    throw new GraphQLError("You do not have permission to access this resource", {
      extensions: { code: "FORBIDDEN" },
    });
  }
  
  return user;
}