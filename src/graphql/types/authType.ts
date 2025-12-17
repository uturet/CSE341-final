// src/graphql/types/authType.ts
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from "graphql";
import { UserType } from "./userType.js";

export const AuthPayloadType = new GraphQLObjectType({
  name: "AuthPayload",
  fields: () => ({
    success: { type: new GraphQLNonNull(GraphQLBoolean) },
    token: { type: GraphQLString },
    user: { type: UserType },
    message: { type: GraphQLString }
  })
});