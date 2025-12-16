import { runQuery } from './utils.js';
import { UserModel } from '../../src/models/user.js';
import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId().toString();

describe('User GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('query user by id', async () => {
    UserModel.findById.mockResolvedValue({
      _id: userId,
      googleId: 'g1',
      email: 'a@test.com',
      name: 'Alex',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      query ($id: ID!) {
        user(id: $id) {
          id
          email
          name
        }
      }
    `, { id: userId });

    expect(res.errors).toBeUndefined();
    expect(res.data?.user.email).toBe('a@test.com');
  });

  test('query user invalid id throws error', async () => {
    const res = await runQuery(`
      query {
        user(id: "123") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid user ID');
  });

  test('create user', async () => {
    UserModel.create.mockResolvedValue({
      _id: userId,
      googleId: 'g1',
      email: 'a@test.com',
      name: 'Alex',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      mutation ($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          email
        }
      }
    `, {
      input: {
        googleId: 'g1',
        email: 'a@test.com',
        name: 'Alex',
      },
    });

    expect(res.data?.createUser.email).toBe('a@test.com');
  });

  test('update user', async () => {
    UserModel.findByIdAndUpdate.mockResolvedValue({
      _id: userId,
      email: 'new@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      mutation ($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          email
        }
      }
    `, {
      id: userId,
      input: { email: 'new@test.com' },
    });

    expect(res.data?.updateUser.email).toBe('new@test.com');
  });

  test('delete user', async () => {
    UserModel.findByIdAndDelete.mockResolvedValue({});

    const res = await runQuery(`
      mutation ($id: ID!) {
        deleteUser(id: $id)
      }
    `, { id: userId });

    expect(res.data?.deleteUser).toBe('User deleted');
  });
});
