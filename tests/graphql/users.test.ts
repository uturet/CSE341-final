// /tests/graphql/users.test.ts
import { runQuery, runAuthQuery } from './utils.js';
import { UserModel } from '../../src/models/user.js';
import mongoose from 'mongoose';

const userId = '694333d200187b431e4ee1b1'; // Real user ID

describe('User GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should require authentication for user query', async () => {
    const res = await runQuery(`
      query ($id: ID!) {
        user(id: $id) {
          id
        }
      }
    `, { id: userId });

    expect(res.errors).toBeDefined();
    expect(res.errors?.[0].message).toBe('Authentication required');
  });

  test('query user by id when authenticated', async () => {
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
      email: '10toasterg@gmail.com',
      name: '10toaster G',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    UserModel.findById = jest.fn().mockResolvedValue(mockUser);
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);

    const res = await runAuthQuery(`
      query ($id: ID!) {
        user(id: $id) {
          id
          email
          name
        }
      }
    `, { id: userId });

    expect(res.errors).toBeUndefined();
    expect((res.data as any)?.user.email).toBe('10toasterg@gmail.com');
  });

  test('query user invalid id throws error', async () => {
    const res = await runAuthQuery(`
      query {
        user(id: "123") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid user ID');
  });

  test('create user', async () => {
    UserModel.create = jest.fn().mockResolvedValue({
      _id: userId,
      googleId: '104033539283338196039',
      email: '10toasterg@gmail.com',
      name: '10toaster G',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runAuthQuery(`
      mutation ($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          email
        }
      }
    `, {
      input: {
        googleId: '104033539283338196039',
        email: '10toasterg@gmail.com',
        name: '10toaster G',
      },
    });

    expect((res.data as any)?.createUser.email).toBe('10toasterg@gmail.com');
  });

  test('update user', async () => {
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
    };

    UserModel.findById = jest.fn().mockResolvedValue(mockUser);
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
    UserModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: userId,
      email: 'newemail@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runAuthQuery(`
      mutation ($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          email
        }
      }
    `, {
      id: userId,
      input: { email: 'newemail@test.com' },
    });

    expect((res.data as any)?.updateUser.email).toBe('newemail@test.com');
  });

  test('delete user', async () => {
    const mockUser = {
      _id: userId,
      googleId: '104033539283338196039',
    };

    UserModel.findById = jest.fn().mockResolvedValue(mockUser);
    UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
    UserModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

    const res = await runAuthQuery(`
      mutation ($id: ID!) {
        deleteUser(id: $id)
      }
    `, { id: userId });

    expect((res.data as any)?.deleteUser).toBe('User deleted');
  });

  test('should prevent updating another user profile', async () => {
    const otherUserId = new mongoose.Types.ObjectId().toString();
    const otherUser = {
      _id: otherUserId,
      googleId: 'different-google-id',
    };

    const authenticatedUser = {
      _id: userId,
      googleId: '104033539283338196039',
    };

    UserModel.findById = jest.fn().mockResolvedValue(otherUser);
    UserModel.findOne = jest.fn().mockResolvedValue(authenticatedUser);

    const res = await runAuthQuery(`
      mutation ($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          email
        }
      }
    `, {
      id: otherUserId,
      input: { email: 'hacker@test.com' },
    });

    expect(res.errors).toBeDefined();
    expect(res.errors?.[0].message).toBe('You can only update your own profile');
  });
});