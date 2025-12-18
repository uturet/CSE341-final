// /tests/graphql/channels.test.ts
import { runQuery, runAuthQuery } from './utils.js';
import { ChannelModel } from '../../src/models/channel.js';
import { UserModel } from '../../src/models/user.js';
import { ProjectModel } from '../../src/models/project.js';
import mongoose from 'mongoose';

const channelId = new mongoose.Types.ObjectId().toString();
const projectId = new mongoose.Types.ObjectId().toString();
const userId = '694333d200187b431e4ee1b1'; // Real user ID

describe('Channel GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should require authentication for channel query', async () => {
    const res = await runQuery(`
      query {
        channel(id: "${channelId}") {
          id
        }
      }
    `);

    expect(res.errors).toBeDefined();
    expect(res.errors?.[0].message).toBe('Authentication required');
  });

  test('query channel by id when authenticated', async () => {
    // Mock user with real data
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
      email: '10toasterg@gmail.com',
      name: '10toaster G',
    };
    
    // Mock BOTH findOne (for auth) and findById (for verifyProjectOwnership)
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);

    // Mock project
    const mockProject = {
      _id: projectId,
      userId,
      title: 'Test Project',
    };
    ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);

    ChannelModel.findById = jest.fn().mockResolvedValue({
      _id: channelId,
      projectId,
      ytChannelId: 'yt-channel',
      name: 'Channel',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runAuthQuery(`
      query ($id: ID!) {
        channel(id: $id) {
          id
          ytChannelId
        }
      }
    `, { id: channelId });

    expect(res.errors).toBeUndefined();
    expect((res.data as any)?.channel.ytChannelId).toBe('yt-channel');
  });

  test('invalid channel id error', async () => {
    const res = await runAuthQuery(`
      query {
        channel(id: "bad") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid channel ID');
  });

  test('create channel', async () => {
    // Mock user with real data
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
      email: '10toasterg@gmail.com',
      name: '10toaster G',
    };
    
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);

    // Mock project
    const mockProject = {
      _id: projectId,
      userId,
      title: 'Test Project',
    };
    ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);

    ChannelModel.create = jest.fn().mockResolvedValue({
      _id: channelId,
      projectId,
      ytChannelId: 'yt-channel',
      name: 'New Channel',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runAuthQuery(`
      mutation ($input: CreateChannelInput!) {
        createChannel(input: $input) {
          name
          ytChannelId
        }
      }
    `, {
      input: {
        projectId,
        ytChannelId: 'yt-channel',
        name: 'New Channel',
      },
    });

    expect((res.data as any)?.createChannel.name).toBe('New Channel');
  });

  test('update channel', async () => {
    // Mock user with real data
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
      email: '10toasterg@gmail.com',
      name: '10toaster G',
    };
    
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);

    // Mock project
    const mockProject = {
      _id: projectId,
      userId,
      title: 'Test Project',
    };
    ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);

    ChannelModel.findById = jest.fn().mockResolvedValue({
      _id: channelId,
      projectId,
    });

    ChannelModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: channelId,
      name: 'Updated Channel',
    });

    const res = await runAuthQuery(`
      mutation ($id: ID!, $input: UpdateChannelInput!) {
        updateChannel(id: $id, input: $input) {
          name
        }
      }
    `, {
      id: channelId,
      input: { name: 'Updated Channel' },
    });

    expect((res.data as any)?.updateChannel.name).toBe('Updated Channel');
  });

  test('delete channel', async () => {
    // Mock user with real data
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
      email: '10toasterg@gmail.com',
      name: '10toaster G',
    };
    
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);

    // Mock project
    const mockProject = {
      _id: projectId,
      userId,
      title: 'Test Project',
    };
    ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);

    ChannelModel.findById = jest.fn().mockResolvedValue({
      _id: channelId,
      projectId,
    });

    ChannelModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

    const res = await runAuthQuery(`
      mutation ($id: ID!) {
        deleteChannel(id: $id)
      }
    `, { id: channelId });

    expect((res.data as any)?.deleteChannel).toBe('Channel deleted');
  });
});