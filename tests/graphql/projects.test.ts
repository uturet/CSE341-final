// /tests/graphql/projects.test.ts
import { runQuery, runAuthQuery } from './utils.js';
import { ProjectModel } from '../../src/models/project.js';
import { UserModel } from '../../src/models/user.js';
import mongoose from 'mongoose';

const projectId = new mongoose.Types.ObjectId().toString();
const userId = '694333d200187b431e4ee1b1'; // Real user ID

describe('Project GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Queries', () => {
    test('should query project by id when authenticated', async () => {
      const mockUser = {
        _id: userId,
        googleId: '104033539283338196039',
        email: '10toasterg@gmail.com',
      };

      const mockProject = {
        _id: projectId,
        userId,
        title: 'Test Project',
        description: 'A test project',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);
      UserModel.findById = jest.fn().mockResolvedValue(mockUser);
      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await runAuthQuery(`
        query ($id: ID!) {
          project(id: $id) {
            id
            title
            description
          }
        }
      `, { id: projectId });

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.project.title).toBe('Test Project');
    });

    test('should require authentication for project query', async () => {
      const res = await runQuery(`
        query ($id: ID!) {
          project(id: $id) {
            id
          }
        }
      `, { id: projectId });

      expect(res.errors).toBeDefined();
      expect(res.errors?.[0].message).toBe('Authentication required');
    });

    test('should reject invalid project id', async () => {
      const res = await runAuthQuery(`
        query {
          project(id: "bad-id") {
            id
          }
        }
      `);

      expect(res.errors?.[0].message).toBe('Invalid project ID');
    });

    test('should query projects list when authenticated', async () => {
      const mockUser = {
        _id: userId,
        googleId: '104033539283338196039',
      };

      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
      ProjectModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            _id: projectId,
            userId,
            title: 'Project 1',
          },
        ]),
      });

      const res = await runAuthQuery(`
        query {
          projects {
            id
            title
          }
        }
      `);

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.projects).toHaveLength(1);
      expect((res.data as any)?.projects[0].title).toBe('Project 1');
    });
  });

  describe('Mutations', () => {
    test('should create project when authenticated', async () => {
      const mockUser = {
        _id: userId,
        googleId: '104033539283338196039',
      };

      UserModel.findById = jest.fn().mockResolvedValue(mockUser);
      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
      ProjectModel.create = jest.fn().mockResolvedValue({
        _id: projectId,
        userId,
        title: 'New Project',
        description: 'New description',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await runAuthQuery(`
        mutation ($input: CreateProjectInput!) {
          createProject(input: $input) {
            id
            title
            description
          }
        }
      `, {
        input: {
          userId,  // Use real user ID
          title: 'New Project',
          description: 'New description',
        },
      });

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.createProject.title).toBe('New Project');
    });

    test('should require authentication to create project', async () => {
      const res = await runQuery(`
        mutation ($input: CreateProjectInput!) {
          createProject(input: $input) {
            id
          }
        }
      `, {
        input: {
          userId,
          title: 'Test',
        },
      });

      expect(res.errors).toBeDefined();
      expect(res.errors?.[0].message).toBe('Authentication required');
    });

    test('should prevent creating project for another user', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const mockAuthUser = {
        _id: userId,
        googleId: '104033539283338196039',
      };

      const mockOtherUser = {
        _id: otherUserId,
        googleId: 'other-google-id',
      };

      UserModel.findById = jest.fn().mockResolvedValue(mockOtherUser);
      UserModel.findOne = jest.fn().mockResolvedValue(mockAuthUser);

      const res = await runAuthQuery(`
        mutation ($input: CreateProjectInput!) {
          createProject(input: $input) {
            id
          }
        }
      `, {
        input: {
          userId: otherUserId,
          title: 'Unauthorized Project',
        },
      });

      expect(res.errors).toBeDefined();
      expect(res.errors?.[0].message).toBe('You can only create projects for yourself');
    });

    test('should update project when authenticated and authorized', async () => {
      const mockUser = {
        _id: userId,
        googleId: '104033539283338196039',
      };

      const mockProject = {
        _id: projectId,
        userId,
      };

      ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);
      UserModel.findById = jest.fn().mockResolvedValue(mockUser);
      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
      ProjectModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: projectId,
        title: 'Updated Project',
      });

      const res = await runAuthQuery(`
        mutation ($id: ID!, $input: UpdateProjectInput!) {
          updateProject(id: $id, input: $input) {
            title
          }
        }
      `, {
        id: projectId,
        input: { title: 'Updated Project' },
      });

      expect(res.errors).toBeUndefined();
      expect((res.data as any)?.updateProject.title).toBe('Updated Project');
    });

    test('should delete project when authenticated and authorized', async () => {
      const mockUser = {
        _id: userId,
        googleId: '104033539283338196039',
      };

      const mockProject = {
        _id: projectId,
        userId,
      };

      ProjectModel.findById = jest.fn().mockResolvedValue(mockProject);
      UserModel.findById = jest.fn().mockResolvedValue(mockUser);
      UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
      ProjectModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

      const res = await runAuthQuery(`
        mutation ($id: ID!) {
          deleteProject(id: $id)
        }
      `, { id: projectId });

      expect((res.data as any)?.deleteProject).toBe('Project deleted');
    });

    test('should validate project id format', async () => {
      const res = await runAuthQuery(`
        mutation ($input: CreateProjectInput!) {
          createProject(input: $input) {
            id
          }
        }
      `, {
        input: {
          userId: 'invalid-id',
          title: 'Test',
        },
      });

      expect(res.errors?.[0].message).toBe('Invalid user ID');
    });
  });
});