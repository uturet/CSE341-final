// src/graphql/types/videoType.ts
import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ProjectType } from "./projectType";
import { ProjectModel } from "../../models/project";

export const VideoType = new GraphQLObjectType({
  name: "Video",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    projectId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.projectId.toString() },
    project: { type: ProjectType, resolve: async (parent) => ProjectModel.findById(parent.projectId) },
    title: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    ytVideoId: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    captions: { type: GraphQLString },
    length: { type: GraphQLInt },
    views: { type: GraphQLInt },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) }
  })
});