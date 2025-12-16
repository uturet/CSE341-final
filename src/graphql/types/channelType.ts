// src/graphql/types/channelType.ts
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ProjectType } from "./projectType";
import { ProjectModel } from "../../models/project";

export const ChannelType = new GraphQLObjectType({
  name: "Channel",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (parent) => parent._id.toString(),
    },
    projectId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (parent) => parent.projectId.toString(),
    },
    project: {
      type: ProjectType,
      resolve: async (parent) => ProjectModel.findById(parent.projectId),
    },
    name: { type: GraphQLString },
    ytChannelId: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  }),
});
