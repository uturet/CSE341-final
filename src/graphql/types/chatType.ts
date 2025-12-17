// src/graphql/types/chatType.ts
import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList, GraphQLEnumType } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ProjectType } from "./projectType.js";
import { ProjectModel } from "../../models/project.js";
import { VideoModel } from "../../models/video.js";

// ENUM for message sender
export const MessageSenderEnum = new GraphQLEnumType({
  name: "MessageSender",
  values: {
    user: { value: "user" },
    assistant: { value: "assistant" }
  }
});

// Message Type
export const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: {
    sender: { type: new GraphQLNonNull(MessageSenderEnum) },
    text: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Chat Type
export const ChatType = new GraphQLObjectType({
  name: "Chat",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    projectId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.projectId.toString() },
    project: { type: ProjectType, resolve: parent => ProjectModel.findById(parent.projectId) },
    videoId: { type: GraphQLID, resolve: (parent) => parent.videoId?.toString() },
    video: { type: GraphQLID, resolve: (parent) => parent.videoId && VideoModel.findById(parent.videoId) },
    title: { type: GraphQLString },
    messages: { type: new GraphQLList(MessageType) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) }
  })
});