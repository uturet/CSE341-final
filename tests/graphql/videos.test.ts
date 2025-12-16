import { runQuery } from './utils.js';
import { VideoModel } from '../../src/models/video.js';
import mongoose from 'mongoose';

const videoId = new mongoose.Types.ObjectId().toString();
const projectId = new mongoose.Types.ObjectId().toString();

describe('Video GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('query video by id', async () => {
    VideoModel.findById.mockResolvedValue({
      _id: videoId,
      projectId,
      ytVideoId: 'yt123',
      title: 'Video',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      query ($id: ID!) {
        video(id: $id) {
          id
          ytVideoId
        }
      }
    `, { id: videoId });

    expect(res.errors).toBeUndefined();
    expect(res.data?.video.ytVideoId).toBe('yt123');
  });

  test('invalid video id error', async () => {
    const res = await runQuery(`
      query {
        video(id: "bad") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid video ID');
  });

  test('create video', async () => {
    VideoModel.create.mockResolvedValue({
      _id: videoId,
      projectId,
      ytVideoId: 'yt123',
      title: 'New Video',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      mutation ($input: CreateVideoInput!) {
        createVideo(input: $input) {
          ytVideoId
          title
        }
      }
    `, {
      input: {
        projectId,
        ytVideoId: 'yt123',
        title: 'New Video',
      },
    });

    expect(res.data?.createVideo.ytVideoId).toBe('yt123');
  });

  test('update video', async () => {
    VideoModel.findByIdAndUpdate.mockResolvedValue({
      _id: videoId,
      title: 'Updated Video',
    });

    const res = await runQuery(`
      mutation ($id: ID!, $input: UpdateVideoInput!) {
        updateVideo(id: $id, input: $input) {
          title
        }
      }
    `, {
      id: videoId,
      input: { title: 'Updated Video' },
    });

    expect(res.data?.updateVideo.title).toBe('Updated Video');
  });

  test('delete video', async () => {
    VideoModel.findByIdAndDelete.mockResolvedValue({});

    const res = await runQuery(`
      mutation ($id: ID!) {
        deleteVideo(id: $id)
      }
    `, { id: videoId });

    expect(res.data?.deleteVideo).toBe('Video deleted');
  });
});
