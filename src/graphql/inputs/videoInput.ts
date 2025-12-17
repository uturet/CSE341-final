// src/graphql/inputs/videoInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from "graphql";

export const CreateVideoInputType = new GraphQLInputObjectType({
  name: "CreateVideoInput",
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    ytVideoLink: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const UpdateVideoInputType = new GraphQLInputObjectType({
  name: "UpdateVideoInput",
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    transcript: { type: GraphQLString }
  }
});