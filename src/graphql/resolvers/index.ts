// src/graphql/resolvers/index.ts
import { userResolvers } from "./userResolver";
import { projectResolvers } from "./projectResolver";
import { chatResolvers } from "./chatResolver";
import { videoResolvers } from "./videoResolver";
import { channelResolvers } from "./channelResolver";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...chatResolvers.Query,
    ...videoResolvers.Query,
    ...channelResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...videoResolvers.Mutation,
    ...channelResolvers.Mutation,
  },
};

export default resolvers;