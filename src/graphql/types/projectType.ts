// src/graphql/types/projectType.ts
import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { UserType } from "./userType";
import { ChannelType } from "./channelType";
import { VideoType } from "./videoType";
import { ChatType } from "./chatType.js";
import { UserModel } from "../../models/user";
import { ChannelModel } from "../../models/channel";
import { VideoModel } from "../../models/video";
import { ChatModel } from "../../models/chat";

export const ProjectType: GraphQLObjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    userId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.userId.toString() },
    user: { type: UserType, resolve: async (parent) => UserModel.findById(parent.userId) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    channels: { type: new GraphQLList(ChannelType), resolve: async (parent) => ChannelModel.find({ projectId: parent._id }) },
    videos: { type: new GraphQLList(VideoType), resolve: async (parent) => VideoModel.find({ projectId: parent._id }) },
    chats: { type: new GraphQLList(ChatType), resolve: async (parent) => ChatModel.find({ projectId: parent._id }) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) }
  })
});