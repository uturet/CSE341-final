// src/graphql/inputs/projectInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from "graphql";

export const CreateProjectInputType = new GraphQLInputObjectType({
  name: "CreateProjectInput",
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  }
});

export const UpdateProjectInputType = new GraphQLInputObjectType({
  name: "UpdateProjectInput",
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});