// src/graphql/inputs/userInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const CreateUserInputType = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    googleId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString }
  }
});

export const UpdateUserInputType = new GraphQLInputObjectType({
  name: "UpdateUserInput",
  fields: {
    email: { type: GraphQLString },
    name: { type: GraphQLString }
  }
});