// /tests/graphql/chats.test.ts
import { runQuery, runAuthQuery } from './utils.js';
import { ChatModel } from '../../src/models/chat.js';
import { UserModel } from '../../src/models/user.js';
import { ProjectModel } from '../../src/models/project.js';
import { VideoModel } from '../../src/models/video.js';
import mongoose from 'mongoose';

const chatId = new mongoose.Types.ObjectId().toString();
const projectId = new mongoose.Types.ObjectId().toString();
const userId = '694333d200187b431e4ee1b1'; // Real user ID

describe('Chat GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should require authentication for chat query', async () => {
    const res = await runQuery(`
      query {
        chat(id: "${chatId}") {
          id
        }
      }
    `);

    expect(res.errors).toBeDefined();
    expect(res.errors?.[0].message).toBe('Authentication required');
  });

  test('query chat by id when authenticated', async () => {
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

    ChatModel.findById = jest.fn().mockResolvedValue({
      _id: chatId,
      projectId,
      title: 'Test Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runAuthQuery(`
      query ($id: ID!) {
        chat(id: $id) {
          id
          title
        }
      }
    `, { id: chatId });

    expect(res.errors).toBeUndefined();
    expect((res.data as any)?.chat.title).toBe('Test Chat');
  });

  test('query chat with invalid id', async () => {
    const res = await runAuthQuery(`
      query {
        chat(id: "bad-id") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid chat ID');
  });

  test.skip('create chat', async () => {
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

    // Mock the video that the chat needs
    const videoId = new mongoose.Types.ObjectId().toString();
    const mockVideo = {
      _id: videoId,
      projectId,
      transcript: 'This is a test transcript',
    };
    VideoModel.findById = jest.fn().mockResolvedValue(mockVideo);
    
    // Mock the chat creation - chatWithVideo is already mocked in setup.ts
    const mockChat = {
      _id: chatId,
      projectId,
      videoId,
      title: 'New Chat',
      messages: [
        { sender: 'user', text: 'Test message' },
        { sender: 'assistant', text: 'AI response' }
      ],
    };

    const res = await runAuthQuery(`
      mutation ($input: CreateChatInput!) {
        createChat(input: $input) {
          id
          title
        }
      }
    `, {
      input: {
        projectId,
        videoId,
        title: 'New Chat',
        messages: [{ sender: 'user', text: 'Test message' }],
      },
    });

    // The service is mocked to return null, so verify no errors
    expect(res.errors).toBeUndefined();
  });

  test('update chat', async () => {
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

    ChatModel.findById = jest.fn().mockResolvedValue({
      _id: chatId,
      projectId,
    });

    ChatModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: chatId,
      title: 'Updated Chat',
      updatedAt: new Date(),
    });

    const res = await runAuthQuery(`
      mutation ($id: ID!, $input: UpdateChatInput!) {
        updateChat(id: $id, input: $input) {
          title
        }
      }
    `, {
      id: chatId,
      input: { title: 'Updated Chat' },
    });

    expect((res.data as any)?.updateChat.title).toBe('Updated Chat');
  });

  test('delete chat', async () => {
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

    ChatModel.findById = jest.fn().mockResolvedValue({
      _id: chatId,
      projectId,
    });

    ChatModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

    const res = await runAuthQuery(`
      mutation ($id: ID!) {
        deleteChat(id: $id)
      }
    `, { id: chatId });

    expect((res.data as any)?.deleteChat).toBe('Chat deleted');
  });
});