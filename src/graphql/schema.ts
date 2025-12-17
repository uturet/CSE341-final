// src/graphql/schema.ts
import { GraphQLSchema, GraphQLObjectType, GraphQLList } from "graphql";
import resolvers from "./resolvers/index.js";
import { UserType } from "./types/userType.js";
import { ProjectType } from "./types/projectType.js";
import { ChatType } from "./types/chatType.js";
import { VideoType } from "./types/videoType.js";
import { ChannelType } from "./types/channelType.js";
import { AuthPayloadType } from "./types/authType.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    // Auth Queries
    verifyToken: {
      type: AuthPayloadType,
      args: resolvers.Query.verifyToken.args,
      resolve: resolvers.Query.verifyToken.resolve,
    },
    me: {
      type: AuthPayloadType,
      // @ts-ignore
      args: resolvers.Query.me?.args || {},
      resolve: resolvers.Query.me.resolve,
    },

    // Users
    user: {
      type: UserType,
      args: resolvers.Query.user.args,
      resolve: resolvers.Query.user.resolve,
    },
    users: {
      type: new GraphQLList(UserType),
      args: resolvers.Query.users.args,
      resolve: resolvers.Query.users.resolve,
    },

    // Projects
    project: {
      type: ProjectType,
      args: resolvers.Query.project.args,
      resolve: resolvers.Query.project.resolve,
    },
    projects: {
      type: new GraphQLList(ProjectType),
      args: resolvers.Query.projects.args,
      resolve: resolvers.Query.projects.resolve,
    },

    // Chats
    chat: {
      type: ChatType,
      args: resolvers.Query.chat.args,
      resolve: resolvers.Query.chat.resolve,
    },
    chats: {
      type: new GraphQLList(ChatType),
      args: resolvers.Query.chats.args,
      resolve: resolvers.Query.chats.resolve,
    },

    // Videos
    video: {
      type: VideoType,
      args: resolvers.Query.video.args,
      resolve: resolvers.Query.video.resolve,
    },
    videos: {
      type: new GraphQLList(VideoType),
      args: resolvers.Query.videos.args,
      resolve: resolvers.Query.videos.resolve,
    },

    // Channels
    channel: {
      type: ChannelType,
      args: resolvers.Query.channel.args,
      resolve: resolvers.Query.channel.resolve,
    },
    channels: {
      type: new GraphQLList(ChannelType),
      args: resolvers.Query.channels.args,
      resolve: resolvers.Query.channels.resolve,
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...resolvers.Mutation,
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});