import { runQuery } from './utils.js';
import { ProjectModel } from '../../src/models/project.js';
import mongoose from 'mongoose';

const projectId = new mongoose.Types.ObjectId().toString();
const userId = new mongoose.Types.ObjectId().toString();

describe('Project GraphQL', () => {
  beforeEach(() => jest.clearAllMocks());

  test('create project', async () => {
    ProjectModel.create.mockResolvedValue({
      _id: projectId,
      title: 'Test',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await runQuery(`
      mutation ($input: CreateProjectInput!) {
        createProject(input: $input) {
          id
          title
        }
      }
    `, {
      input: { userId, title: 'Test' },
    });

    expect(res.data?.createProject.title).toBe('Test');
  });

  test('project invalid id error', async () => {
    const res = await runQuery(`
      query {
        project(id: "bad") {
          id
        }
      }
    `);

    expect(res.errors?.[0].message).toBe('Invalid project ID');
  });
});
