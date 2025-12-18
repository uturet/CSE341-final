// /tests/graphql/auth.test.ts
import { runQuery, runAuthQuery } from './utils.js';
import { UserModel } from '../../src/models/user.js';
import * as jwt from 'jsonwebtoken'; // Fixed import

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth GraphQL Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('verifyToken Query', () => {
    test('should verify valid token', async () => {
      const mockUser = {
        _id: 'user123',
        googleId: 'google123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockedJwt.verify.mockReturnValue({ googleId: 'google123' } as any);
      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await runQuery(`
        query VerifyToken($token: String!) {
          verifyToken(token: $token) {
            success
            message
            user {
              id
              email
            }
          }
        }
      `, {
        token: 'valid-token-123',
      });

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.verifyToken.success).toBe(true);
      expect((res.data as any)?.verifyToken.message).toBe('Token is valid');
      expect((res.data as any)?.verifyToken.user.email).toBe('test@example.com');
    });

    test('should reject invalid token', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const res = await runQuery(`
        query VerifyToken($token: String!) {
          verifyToken(token: $token) {
            success
            message
          }
        }
      `, {
        token: 'invalid-token',
      });

      expect((res.data as any)?.verifyToken.success).toBe(false);
      expect((res.data as any)?.verifyToken.message).toBe('Invalid or expired token');
    });

    test('should return error when user not found', async () => {
      mockedJwt.verify.mockReturnValue({ googleId: 'nonexistent' } as any);
      UserModel.findOne = jest.fn().mockResolvedValue(null);

      const res = await runQuery(`
        query VerifyToken($token: String!) {
          verifyToken(token: $token) {
            success
            message
          }
        }
      `, {
        token: 'valid-token-but-no-user',
      });

      expect((res.data as any)?.verifyToken.success).toBe(false);
      expect((res.data as any)?.verifyToken.message).toBe('User not found');
    });
  });

  describe('me Query', () => {
    test('should return current user when authenticated', async () => {
      const mockUser = {
        _id: 'user123',
        googleId: 'test-google-id-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await runAuthQuery(`
        query {
          me {
            success
            message
            user {
              id
              email
              name
            }
          }
        }
      `);

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.me.success).toBe(true);
      expect((res.data as any)?.me.message).toBe('Authenticated');
      expect((res.data as any)?.me.user.email).toBe('test@example.com');
    });

    test('should fail when not authenticated', async () => {
      const res = await runQuery(`
        query {
          me {
            success
            message
          }
        }
      `);

      expect((res.data as any)?.me.success).toBe(false);
      expect((res.data as any)?.me.message).toBe('Not authenticated');
    });

    test('should handle user not found in database', async () => {
      UserModel.findOne = jest.fn().mockResolvedValue(null);

      const res = await runAuthQuery(`
        query {
          me {
            success
            message
          }
        }
      `);

      expect((res.data as any)?.me.success).toBe(false);
      expect((res.data as any)?.me.message).toBe('User not found');
    });
  });

  describe('googleAuth Mutation', () => {
    test('should authenticate existing user', async () => {
      const existingUser = {
        _id: 'user123',
        googleId: 'google123',
        email: 'existing@example.com',
        name: 'Existing User',
        save: jest.fn(),
      };

      UserModel.findOne = jest.fn().mockResolvedValue(existingUser);
      mockedJwt.sign.mockReturnValue('generated-token-123' as any);

      const res = await runQuery(`
        mutation GoogleAuth($input: GoogleAuthInput!) {
          googleAuth(input: $input) {
            success
            token
            message
            user {
              id
              email
            }
          }
        }
      `, {
        input: {
          googleId: 'google123',
          email: 'existing@example.com',
          name: 'Existing User',
        },
      });

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.googleAuth.success).toBe(true);
      expect((res.data as any)?.googleAuth.message).toBe('Authentication successful');
      expect((res.data as any)?.googleAuth.token).toBe('generated-token-123');
    });

    test('should create new user if not exists', async () => {
      const newUser = {
        _id: 'newuser123',
        googleId: 'google456',
        email: 'new@example.com',
        name: 'New User',
      };

      UserModel.findOne = jest.fn().mockResolvedValue(null);
      UserModel.create = jest.fn().mockResolvedValue(newUser);
      mockedJwt.sign.mockReturnValue('new-user-token' as any);

      const res = await runQuery(`
        mutation GoogleAuth($input: GoogleAuthInput!) {
          googleAuth(input: $input) {
            success
            token
            user {
              email
            }
          }
        }
      `, {
        input: {
          googleId: 'google456',
          email: 'new@example.com',
          name: 'New User',
        },
      });

      expect((res.data as any)?.googleAuth.success).toBe(true);
      expect((res.data as any)?.googleAuth.user.email).toBe('new@example.com');
      expect(UserModel.create).toHaveBeenCalledWith({
        googleId: 'google456',
        email: 'new@example.com',
        name: 'New User',
      });
    });

    test('should update user name if changed', async () => {
      const user = {
        _id: 'user123',
        googleId: 'google123',
        email: 'user@example.com',
        name: 'Old Name',
        save: jest.fn(),
      };

      UserModel.findOne = jest.fn().mockResolvedValue(user);
      mockedJwt.sign.mockReturnValue('token-123' as any);

      await runQuery(`
        mutation GoogleAuth($input: GoogleAuthInput!) {
          googleAuth(input: $input) {
            success
          }
        }
      `, {
        input: {
          googleId: 'google123',
          email: 'user@example.com',
          name: 'New Name',
        },
      });

      expect(user.name).toBe('New Name');
      expect(user.save).toHaveBeenCalled();
    });
  });

  describe('refreshToken Mutation', () => {
    test('should refresh valid token', async () => {
      const mockUser = {
        _id: 'user123',
        googleId: 'google123',
        email: 'test@example.com',
      };

      mockedJwt.verify.mockReturnValue({ googleId: 'google123' } as any);
      mockedJwt.sign.mockReturnValue('new-refreshed-token' as any);
      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await runQuery(`
        mutation RefreshToken($token: String!) {
          refreshToken(token: $token) {
            success
            token
            message
          }
        }
      `, {
        token: 'old-token-123',
      });

      expect((res.data as any)?.refreshToken.success).toBe(true);
      expect((res.data as any)?.refreshToken.token).toBe('new-refreshed-token');
      expect((res.data as any)?.refreshToken.message).toBe('Token refreshed successfully');
    });

    test('should reject invalid token for refresh', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const res = await runQuery(`
        mutation RefreshToken($token: String!) {
          refreshToken(token: $token) {
            success
            message
          }
        }
      `, {
        token: 'invalid-token',
      });

      expect((res.data as any)?.refreshToken.success).toBe(false);
      expect((res.data as any)?.refreshToken.message).toBe('Invalid or expired token');
    });

    test('should fail if user not found during refresh', async () => {
      mockedJwt.verify.mockReturnValue({ googleId: 'nonexistent' } as any);
      UserModel.findOne = jest.fn().mockResolvedValue(null);

      const res = await runQuery(`
        mutation RefreshToken($token: String!) {
          refreshToken(token: $token) {
            success
            message
          }
        }
      `, {
        token: 'token-for-deleted-user',
      });

      expect((res.data as any)?.refreshToken.success).toBe(false);
      expect((res.data as any)?.refreshToken.message).toBe('User not found');
    });
  });
});