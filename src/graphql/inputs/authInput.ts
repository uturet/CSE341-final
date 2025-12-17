// src/graphql/inputs/authInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const GoogleAuthInputType = new GraphQLInputObjectType({
  name: "GoogleAuthInput",
  fields: {
    googleId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString }
  }
});

export const LoginInputType = new GraphQLInputObjectType({
  name: "LoginInput",
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) }
  }
});