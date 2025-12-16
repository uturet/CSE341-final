import { runQuery } from './utils.js';
import { ChannelModel } from '../../src/models/channel.js';
import mongoose from 'mongoose';

const channelId = new mongoose.Types.ObjectId().toString();
const projectId = new mongoose.Types.ObjectId().toString();

describe('Channel GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('query channel by id', async () => {
    ChannelModel.findById.mockResolvedValue({
      _id: channelId,
      projectId,
      ytChannelId: 'yt-channel',
      name: 'Channel',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      query ($id: ID!) {
        channel(id: $id) {
          id
          ytChannelId
        }
      }
    `, { id: channelId });

    expect(res.errors).toBeUndefined();
    expect(res.data?.channel.ytChannelId).toBe('yt-channel');
  });

  test('invalid channel id error', async () => {
    const res = await runQuery(`
      query {
        channel(id: "bad") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid channel ID');
  });

  test('create channel', async () => {
    ChannelModel.create.mockResolvedValue({
      _id: channelId,
      projectId,
      ytChannelId: 'yt-channel',
      name: 'New Channel',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
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

    expect(res.data?.createChannel.name).toBe('New Channel');
  });

  test('update channel', async () => {
    ChannelModel.findByIdAndUpdate.mockResolvedValue({
      _id: channelId,
      name: 'Updated Channel',
    });

    const res = await runQuery(`
      mutation ($id: ID!, $input: UpdateChannelInput!) {
        updateChannel(id: $id, input: $input) {
          name
        }
      }
    `, {
      id: channelId,
      input: { name: 'Updated Channel' },
    });

    expect(res.data?.updateChannel.name).toBe('Updated Channel');
  });

  test('delete channel', async () => {
    ChannelModel.findByIdAndDelete.mockResolvedValue({});

    const res = await runQuery(`
      mutation ($id: ID!) {
        deleteChannel(id: $id)
      }
    `, { id: channelId });

    expect(res.data?.deleteChannel).toBe('Channel deleted');
  });
});
