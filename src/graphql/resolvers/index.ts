// src/graphql/resolvers/index.ts
import { authResolvers } from "./authResolver.js";
import { userResolvers } from "./userResolver.js";
import { projectResolvers } from "./projectResolver.js";
import { chatResolvers } from "./chatResolver.js";
import { videoResolvers } from "./videoResolver.js";
import { channelResolvers } from "./channelResolver.js";

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...chatResolvers.Query,
    ...videoResolvers.Query,
    ...channelResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...videoResolvers.Mutation,
    ...channelResolvers.Mutation,
  },
};

export default resolvers;