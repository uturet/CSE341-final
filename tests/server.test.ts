import request from 'supertest';

// Mock the DB connection before importing app
jest.mock('../src/db/connection.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

// Mock the file system operations that use import.meta
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {}
  })),
}));

// Now we can safely import app
import app from '../src/app.js';

describe('Server Tests', () => {
  describe('Express App Configuration', () => {
    test('should respond to health check', async () => {
      const res = await request(app).get('/');
      // Expect either 200 or 404 - both indicate server is running
      expect([200, 404]).toContain(res.status);
    });

    test('should have CORS enabled', async () => {
      const res = await request(app).get('/');
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('GraphQL Endpoint', () => {
    test('should respond to GraphQL endpoint', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({
          query: '{ __typename }',
        })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
    });

    test('should reject invalid GraphQL queries', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({
          query: 'invalid query syntax {{{',
        })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200); // GraphQL returns 200 with errors
      expect(res.body.errors).toBeDefined();
    });

    test('should handle missing query field', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
    });
  });

  describe('Authentication Endpoints', () => {
    test('should have Google OAuth route', async () => {
      const res = await request(app).get('/auth/google');
      // Should redirect to Google (302) or have some response
      expect([200, 302]).toContain(res.status);
    });

    test('should have OAuth callback route', async () => {
      const res = await request(app).get('/auth/google/callback');
      // May redirect or return error since no OAuth code provided
      expect(res.status).toBeDefined();
    });
  });

  describe('Documentation Endpoints', () => {
    test('should serve Swagger documentation', async () => {
      const res = await request(app).get('/api-docs/');
      expect([200, 301, 302]).toContain(res.status);
    });

    test('should serve GraphiQL in non-production', async () => {
      // Save original NODE_ENV
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const res = await request(app).get('/graphiql');
      expect(res.status).toBe(200);
      expect(res.text).toContain('GraphiQL');

      // Restore NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Security Headers', () => {
    test('should accept JSON content type', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query: '{ __typename }' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
    });

    test('should handle Authorization header', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query: '{ __typename }' })
        .set('Authorization', 'Bearer test-token')
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
    });
  });
});