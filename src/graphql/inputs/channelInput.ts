// src/graphql/inputs/channelInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from "graphql";

export const CreateChannelInputType = new GraphQLInputObjectType({
  name: "CreateChannelInput",
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    ytChannelId: { type: new GraphQLNonNull(GraphQLString) }
  }
});

export const UpdateChannelInputType = new GraphQLInputObjectType({
  name: "UpdateChannelInput",
  fields: {
    name: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    projectId: { type: GraphQLID }
  }
});