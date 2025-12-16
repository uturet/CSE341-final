import { runQuery } from './utils.js';
import { ChatModel } from '../../src/models/chat.js';
import mongoose from 'mongoose';

const chatId = new mongoose.Types.ObjectId().toString();
const projectId = new mongoose.Types.ObjectId().toString();

describe('Chat GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('query chat by id', async () => {
    ChatModel.findById.mockResolvedValue({
      _id: chatId,
      projectId,
      title: 'Test Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      query ($id: ID!) {
        chat(id: $id) {
          id
          title
        }
      }
    `, { id: chatId });

    expect(res.errors).toBeUndefined();
    expect(res.data?.chat.title).toBe('Test Chat');
  });

  test('query chat with invalid id', async () => {
    const res = await runQuery(`
      query {
        chat(id: "bad-id") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid chat ID');
  });

  test('create chat', async () => {
    ChatModel.create.mockResolvedValue({
      _id: chatId,
      projectId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      mutation ($input: CreateChatInput!) {
        createChat(input: $input) {
          id
          title
        }
      }
    `, {
      input: {
        projectId,
        title: 'New Chat',
        messages: [],
      },
    });

    expect(res.data?.createChat.title).toBe('New Chat');
  });

  test('update chat', async () => {
    ChatModel.findByIdAndUpdate.mockResolvedValue({
      _id: chatId,
      title: 'Updated Chat',
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      mutation ($id: ID!, $input: UpdateChatInput!) {
        updateChat(id: $id, input: $input) {
          title
        }
      }
    `, {
      id: chatId,
      input: { title: 'Updated Chat' },
    });

    expect(res.data?.updateChat.title).toBe('Updated Chat');
  });

  test('delete chat', async () => {
    ChatModel.findByIdAndDelete.mockResolvedValue({});

    const res = await runQuery(`
      mutation ($id: ID!) {
        deleteChat(id: $id)
      }
    `, { id: chatId });

    expect(res.data?.deleteChat).toBe('Chat deleted');
  });
});
