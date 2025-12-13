// src/graphql/schema.ts
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.js';
import { ProjectModel } from '../models/project.js';
import { ChatModel } from '../models/chat.js';
import { VideoModel } from '../models/video.js';
import { ChannelModel } from '../models/channel.js';

// Helper function to validate ObjectId
function validateObjectId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

// Message Enum
const MessageSenderEnum = new GraphQLEnumType({
  name: 'MessageSender',
  values: {
    user: { value: 'user' },
    ai: { value: 'ai' },
  },
});

// Message Type
const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    sender: { type: new GraphQLNonNull(MessageSenderEnum) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// User Type
const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    googleId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: async (parent) => ProjectModel.find({ userId: parent._id }),
    },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  }),
});

// Project Type
const ProjectType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    userId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.userId.toString() },
    user: {
      type: UserType,
      resolve: async (parent) => UserModel.findById(parent.userId),
    },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    channels: {
      type: new GraphQLList(ChannelType),
      resolve: async (parent) => ChannelModel.find({ projectId: parent._id }),
    },
    videos: {
      type: new GraphQLList(VideoType),
      resolve: async (parent) => VideoModel.find({ projectId: parent._id }),
    },
    chats: {
      type: new GraphQLList(ChatType),
      resolve: async (parent) => ChatModel.find({ projectId: parent._id }),
    },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  }),
});

// Chat Type
const ChatType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    projectId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.projectId.toString() },
    project: {
      type: ProjectType,
      resolve: async (parent) => ProjectModel.findById(parent.projectId),
    },
    title: { type: GraphQLString },
    messages: { type: new GraphQLList(MessageType) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  }),
});

// Video Type
const VideoType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Video',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    projectId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.projectId.toString() },
    project: {
      type: ProjectType,
      resolve: async (parent) => ProjectModel.findById(parent.projectId),
    },
    title: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    ytVideoId: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    captions: { type: GraphQLString },
    length: { type: GraphQLInt },
    views: { type: GraphQLInt },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  }),
});

// Channel Type
const ChannelType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Channel',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent._id.toString() },
    projectId: { type: new GraphQLNonNull(GraphQLID), resolve: (parent) => parent.projectId.toString() },
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

// Input Types
const MessageInputType = new GraphQLInputObjectType({
  name: 'MessageInput',
  fields: {
    sender: { type: new GraphQLNonNull(MessageSenderEnum) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    googleId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
  },
});

const UpdateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    email: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const CreateProjectInputType = new GraphQLInputObjectType({
  name: 'CreateProjectInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  },
});

const UpdateProjectInputType = new GraphQLInputObjectType({
  name: 'UpdateProjectInput',
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const CreateChatInputType = new GraphQLInputObjectType({
  name: 'CreateChatInput',
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    messages: { type: new GraphQLList(MessageInputType) },
  },
});

const UpdateChatInputType = new GraphQLInputObjectType({
  name: 'UpdateChatInput',
  fields: {
    title: { type: GraphQLString },
    messages: { type: new GraphQLList(MessageInputType) },
  },
});

const CreateVideoInputType = new GraphQLInputObjectType({
  name: 'CreateVideoInput',
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    ytVideoId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    description: { type: GraphQLString },
    captions: { type: GraphQLString },
    length: { type: GraphQLInt },
    views: { type: GraphQLInt },
  },
});

const UpdateVideoInputType = new GraphQLInputObjectType({
  name: 'UpdateVideoInput',
  fields: {
    title: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    ytVideoId: { type: GraphQLString },
    description: { type: GraphQLString },
    captions: { type: GraphQLString },
    length: { type: GraphQLInt },
    views: { type: GraphQLInt },
  },
});

const CreateChannelInputType = new GraphQLInputObjectType({
  name: 'CreateChannelInput',
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    ytChannelId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UpdateChannelInputType = new GraphQLInputObjectType({
  name: 'UpdateChannelInput',
  fields: {
    name: { type: GraphQLString },
    ytChannelId: { type: GraphQLString },
    projectId: { type: GraphQLID },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // User queries
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid user ID');
        return UserModel.findById(id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { limit, skip }) => {
        return UserModel.find().skip(skip).limit(Math.min(limit, 100));
      },
    },

    // Project queries
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid project ID');
        return ProjectModel.findById(id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      args: {
        userId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { userId, limit, skip }) => {
        const filter: any = {};
        if (userId) {
          if (!validateObjectId(userId)) throw new Error('Invalid user ID');
          filter.userId = new mongoose.Types.ObjectId(userId);
        }
        return ProjectModel.find(filter).skip(skip).limit(Math.min(limit, 100));
      },
    },

    // Chat queries
    chat: {
      type: ChatType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid chat ID');
        return ChatModel.findById(id);
      },
    },
    chats: {
      type: new GraphQLList(ChatType),
      args: {
        projectId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { projectId, limit, skip }) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId)) throw new Error('Invalid project ID');
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
        return ChatModel.find(filter).skip(skip).limit(Math.min(limit, 100));
      },
    },

    // Video queries
    video: {
      type: VideoType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid video ID');
        return VideoModel.findById(id);
      },
    },
    videos: {
      type: new GraphQLList(VideoType),
      args: {
        projectId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { projectId, limit, skip }) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId)) throw new Error('Invalid project ID');
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
        return VideoModel.find(filter).skip(skip).limit(Math.min(limit, 100));
      },
    },

    // Channel queries
    channel: {
      type: ChannelType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid channel ID');
        return ChannelModel.findById(id);
      },
    },
    channels: {
      type: new GraphQLList(ChannelType),
      args: {
        projectId: { type: GraphQLID },
        limit: { type: GraphQLInt, defaultValue: 50 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: async (_, { projectId, limit, skip }) => {
        const filter: any = {};
        if (projectId) {
          if (!validateObjectId(projectId)) throw new Error('Invalid project ID');
          filter.projectId = new mongoose.Types.ObjectId(projectId);
        }
        return ChannelModel.find(filter).skip(skip).limit(Math.min(limit, 100));
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // User mutations
    createUser: {
      type: UserType,
      args: { input: { type: new GraphQLNonNull(CreateUserInputType) } },
      resolve: async (_, { input }) => {
        return UserModel.create(input);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateUserInputType) },
      },
      resolve: async (_, { id, input }) => {
        if (!validateObjectId(id)) throw new Error('Invalid user ID');
        return UserModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid user ID');
        await UserModel.findByIdAndDelete(id);
        return 'User deleted';
      },
    },

    // Project mutations
    createProject: {
      type: ProjectType,
      args: { input: { type: new GraphQLNonNull(CreateProjectInputType) } },
      resolve: async (_, { input }) => {
        if (!validateObjectId(input.userId)) throw new Error('Invalid user ID');
        return ProjectModel.create({
          ...input,
          userId: new mongoose.Types.ObjectId(input.userId),
        });
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateProjectInputType) },
      },
      resolve: async (_, { id, input }) => {
        if (!validateObjectId(id)) throw new Error('Invalid project ID');
        return ProjectModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      },
    },
    deleteProject: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid project ID');
        await ProjectModel.findByIdAndDelete(id);
        return 'Project deleted';
      },
    },

    // Chat mutations
    createChat: {
      type: ChatType,
      args: { input: { type: new GraphQLNonNull(CreateChatInputType) } },
      resolve: async (_, { input }) => {
        if (!validateObjectId(input.projectId)) throw new Error('Invalid project ID');
        return ChatModel.create({
          ...input,
          projectId: new mongoose.Types.ObjectId(input.projectId),
          messages: input.messages || [],
        });
      },
    },
    updateChat: {
      type: ChatType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateChatInputType) },
      },
      resolve: async (_, { id, input }) => {
        if (!validateObjectId(id)) throw new Error('Invalid chat ID');
        return ChatModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      },
    },
    deleteChat: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid chat ID');
        await ChatModel.findByIdAndDelete(id);
        return 'Chat deleted';
      },
    },

    // Video mutations
    createVideo: {
      type: VideoType,
      args: { input: { type: new GraphQLNonNull(CreateVideoInputType) } },
      resolve: async (_, { input }) => {
        if (!validateObjectId(input.projectId)) throw new Error('Invalid project ID');
        return VideoModel.create({
          ...input,
          projectId: new mongoose.Types.ObjectId(input.projectId),
        });
      },
    },
    updateVideo: {
      type: VideoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateVideoInputType) },
      },
      resolve: async (_, { id, input }) => {
        if (!validateObjectId(id)) throw new Error('Invalid video ID');
        return VideoModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      },
    },
    deleteVideo: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid video ID');
        await VideoModel.findByIdAndDelete(id);
        return 'Video deleted';
      },
    },

    // Channel mutations
    createChannel: {
      type: ChannelType,
      args: { input: { type: new GraphQLNonNull(CreateChannelInputType) } },
      resolve: async (_, { input }) => {
        if (!validateObjectId(input.projectId)) throw new Error('Invalid project ID');
        return ChannelModel.create({
          ...input,
          projectId: new mongoose.Types.ObjectId(input.projectId),
        });
      },
    },
    updateChannel: {
      type: ChannelType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateChannelInputType) },
      },
      resolve: async (_, { id, input }) => {
        if (!validateObjectId(id)) throw new Error('Invalid channel ID');
        if (input.projectId && !validateObjectId(input.projectId)) {
          throw new Error('Invalid project ID');
        }
        const update = { ...input };
        if (input.projectId) {
          update.projectId = new mongoose.Types.ObjectId(input.projectId);
        }
        return ChannelModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      },
    },
    deleteChannel: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        if (!validateObjectId(id)) throw new Error('Invalid channel ID');
        await ChannelModel.findByIdAndDelete(id);
        return 'Channel deleted';
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});