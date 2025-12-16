// src/graphql/inputs/videoInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from "graphql";

export const CreateVideoInputType = new GraphQLInputObjectType({
  name: "CreateVideoInput",
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    ytVideoId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    description: { type: GraphQLString },
    captions: { type: GraphQLString },
    length: { type: GraphQLInt },
    views: { type: GraphQLInt }
  }
});

export const UpdateVideoInputType = new GraphQLInputObjectType({
  name: "UpdateVideoInput",
  fields: {
    title: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    ytVideoId: { type: GraphQLString },
    description: { type: GraphQLString },
    captions: { type: GraphQLString },
    length: { type: GraphQLInt },
    views: { type: GraphQLInt }
  }
});