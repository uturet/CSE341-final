// src/graphql/inputs/chatInput.ts
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from "graphql";
import { MessageSenderEnum } from "../types/chatType";

// --- Message Input ---
export const MessageInputType = new GraphQLInputObjectType({
  name: "MessageInput",
  fields: {
    sender: { type: new GraphQLNonNull(MessageSenderEnum) },
    text: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// --- Chat Inputs ---
export const CreateChatInputType = new GraphQLInputObjectType({
  name: "CreateChatInput",
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    videoId: { type: GraphQLID },
    title: { type: GraphQLString },
    messages: { type: new GraphQLList(MessageInputType) }
  }
});

export const UpdateChatInputType = new GraphQLInputObjectType({
  name: "UpdateChatInput",
  fields: {
    title: { type: GraphQLString },
    messages: { type: new GraphQLList(MessageInputType) }
  }
});