// swagger.ts
import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen({ openapi: "3.0.0" });

const doc = {
  info: {
    title: 'Chat with Youtube Videos - GraphQL API',
    version: '1.0.0',
    description: `
GraphQL API for chatting with YouTube videos. This API allows users to:
- Manage projects containing YouTube videos
- Store and retrieve video transcripts
- Create AI-powered chat conversations about video content
- Track YouTube channels

## GraphQL Endpoint
All queries and mutations are sent to: \`POST /graphql\`

## Authentication
Most operations require a JWT token obtained via Google OAuth.
Include the token in the Authorization header: \`Bearer <token>\`

## GraphiQL Interface
Interactive GraphQL explorer available at: \`/graphiql\` (development only)

## Example Query
\`\`\`graphql
query {
  user(id: "507f1f77bcf86cd799439011") {
    id
    email
    name
    projects {
      id
      title
      videos {
        id
        title
        ytVideoId
      }
    }
  }
}
\`\`\`

## Example Mutation
\`\`\`graphql
mutation {
  createProject(input: {
    userId: "507f1f77bcf86cd799439011"
    title: "My Project"
    description: "Project description"
  }) {
    id
    title
    createdAt
  }
}
\`\`\`
    `,
  },
  servers: [
    { 
      url: 'http://localhost:3000', 
      description: 'Local development server' 
    },
  ],
  tags: [
    { 
      name: 'Authentication', 
      description: 'Google OAuth authentication endpoints' 
    },
    { 
      name: 'GraphQL', 
      description: 'GraphQL API endpoint for all queries and mutations' 
    },
  ],
  paths: {
    '/auth/google': {
      get: {
        tags: ['Authentication'],
        summary: 'Initiate Google OAuth login',
        description: 'Redirects to Google OAuth consent screen',
        responses: {
          '302': {
            description: 'Redirect to Google OAuth',
          },
        },
      },
    },
    '/auth/google/callback': {
      get: {
        tags: ['Authentication'],
        summary: 'Google OAuth callback',
        description: 'Handles the callback from Google OAuth and returns a JWT token',
        responses: {
          '200': {
            description: 'Successful authentication',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { 
                      type: 'string', 
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        googleId: { type: 'string', example: '1234567890' },
                        email: { type: 'string', example: 'user@example.com' },
                        name: { type: 'string', example: 'John Doe' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/graphql': {
      post: {
        tags: ['GraphQL'],
        summary: 'GraphQL endpoint',
        description: `
Main GraphQL endpoint for all queries and mutations.

### Available Queries:
- **user(id: ID!)**: Get a single user by ID
- **users(limit: Int, skip: Int)**: Get list of users
- **project(id: ID!)**: Get a single project by ID
- **projects(userId: ID, limit: Int, skip: Int)**: Get list of projects
- **chat(id: ID!)**: Get a single chat by ID
- **chats(projectId: ID, limit: Int, skip: Int)**: Get list of chats
- **video(id: ID!)**: Get a single video by ID
- **videos(projectId: ID, limit: Int, skip: Int)**: Get list of videos
- **channel(id: ID!)**: Get a single channel by ID
- **channels(projectId: ID, limit: Int, skip: Int)**: Get list of channels

### Available Mutations:
- **createUser(input: CreateUserInput!)**: Create a new user
- **updateUser(id: ID!, input: UpdateUserInput!)**: Update a user
- **deleteUser(id: ID!)**: Delete a user
- **createProject(input: CreateProjectInput!)**: Create a new project
- **updateProject(id: ID!, input: UpdateProjectInput!)**: Update a project
- **deleteProject(id: ID!)**: Delete a project
- **createChat(input: CreateChatInput!)**: Create a new chat
- **updateChat(id: ID!, input: UpdateChatInput!)**: Update a chat
- **deleteChat(id: ID!)**: Delete a chat
- **createVideo(input: CreateVideoInput!)**: Create a new video
- **updateVideo(id: ID!, input: UpdateVideoInput!)**: Update a video
- **deleteVideo(id: ID!)**: Delete a video
- **createChannel(input: CreateChannelInput!)**: Create a new channel
- **updateChannel(id: ID!, input: UpdateChannelInput!)**: Update a channel
- **deleteChannel(id: ID!)**: Delete a channel
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query'],
                properties: {
                  query: {
                    type: 'string',
                    description: 'GraphQL query or mutation',
                    example: `query GetUser {
  user(id: "507f1f77bcf86cd799439011") {
    id
    email
    name
    projects {
      id
      title
    }
  }
}`,
                  },
                  variables: {
                    type: 'object',
                    description: 'Variables for the GraphQL query',
                    example: {
                      userId: '507f1f77bcf86cd799439011',
                    },
                  },
                  operationName: {
                    type: 'string',
                    description: 'Optional operation name',
                    example: 'GetUser',
                  },
                },
              },
              examples: {
                'Query User': {
                  value: {
                    query: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    projects {
      id
      title
      description
    }
  }
}`,
                    variables: {
                      id: '507f1f77bcf86cd799439011',
                    },
                  },
                },
                'Create Project': {
                  value: {
                    query: `mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    title
    description
    createdAt
  }
}`,
                    variables: {
                      input: {
                        userId: '507f1f77bcf86cd799439011',
                        title: 'My YouTube Project',
                        description: 'A collection of educational videos',
                      },
                    },
                  },
                },
                'Query Projects with Videos': {
                  value: {
                    query: `query GetProjects($userId: ID!) {
  projects(userId: $userId) {
    id
    title
    videos {
      id
      title
      ytVideoId
      length
      views
    }
    chats {
      id
      title
      messages {
        sender
        text
      }
    }
  }
}`,
                    variables: {
                      userId: '507f1f77bcf86cd799439011',
                    },
                  },
                },
                'Create Video': {
                  value: {
                    query: `mutation CreateVideo($input: CreateVideoInput!) {
  createVideo(input: $input) {
    id
    title
    ytVideoId
    captions
    createdAt
  }
}`,
                    variables: {
                      input: {
                        projectId: '507f1f77bcf86cd799439011',
                        ytVideoId: 'dQw4w9WgXcQ',
                        title: 'Sample Video',
                        description: 'A sample YouTube video',
                        captions: 'Full transcript here...',
                      },
                    },
                  },
                },
                'Create Chat with Messages': {
                  value: {
                    query: `mutation CreateChat($input: CreateChatInput!) {
  createChat(input: $input) {
    id
    title
    messages {
      sender
      text
    }
    createdAt
  }
}`,
                    variables: {
                      input: {
                        projectId: '507f1f77bcf86cd799439011',
                        title: 'Discussion about video',
                        messages: [
                          {
                            sender: 'user',
                            text: 'What is the main topic of this video?',
                          },
                          {
                            sender: 'ai',
                            text: 'The main topic is...',
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful GraphQL response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      description: 'The result of the GraphQL query/mutation',
                    },
                    errors: {
                      type: 'array',
                      description: 'Any errors that occurred',
                      items: {
                        type: 'object',
                        properties: {
                          message: { type: 'string' },
                          locations: { type: 'array' },
                          path: { type: 'array' },
                        },
                      },
                    },
                  },
                },
                examples: {
                  'Successful Query': {
                    value: {
                      data: {
                        user: {
                          id: '507f1f77bcf86cd799439011',
                          email: 'user@example.com',
                          name: 'John Doe',
                          projects: [
                            {
                              id: '507f1f77bcf86cd799439012',
                              title: 'My Project',
                              description: 'Project description',
                            },
                          ],
                        },
                      },
                    },
                  },
                  'Error Response': {
                    value: {
                      errors: [
                        {
                          message: 'Invalid user ID',
                          locations: [{ line: 2, column: 3 }],
                          path: ['user'],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Invalid GraphQL query',
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/graphiql': {
      get: {
        tags: ['GraphQL'],
        summary: 'GraphiQL interactive interface',
        description: 'Web-based GraphQL IDE for exploring the API (development only)',
        responses: {
          '200': {
            description: 'GraphiQL HTML interface',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from Google OAuth login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          googleId: { type: 'string', example: '1234567890' },
          email: { type: 'string', example: 'user@example.com' },
          name: { type: 'string', example: 'John Doe' },
          projects: { 
            type: 'array',
            items: { $ref: '#/components/schemas/Project' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          title: { type: 'string', example: 'My YouTube Project' },
          description: { type: 'string', example: 'A collection of videos' },
          channels: {
            type: 'array',
            items: { $ref: '#/components/schemas/Channel' },
          },
          videos: {
            type: 'array',
            items: { $ref: '#/components/schemas/Video' },
          },
          chats: {
            type: 'array',
            items: { $ref: '#/components/schemas/Chat' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Video: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          title: { type: 'string', example: 'Video Title' },
          ytChannelId: { type: 'string', example: 'UCxxxxxx' },
          ytVideoId: { type: 'string', example: 'dQw4w9WgXcQ' },
          description: { type: 'string', example: 'Video description' },
          captions: { type: 'string', example: 'Full video transcript...' },
          length: { type: 'integer', example: 360 },
          views: { type: 'integer', example: 1000000 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Chat: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          title: { type: 'string', example: 'Chat about video' },
          messages: {
            type: 'array',
            items: { $ref: '#/components/schemas/Message' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Message: {
        type: 'object',
        properties: {
          sender: { 
            type: 'string', 
            enum: ['user', 'ai'],
            example: 'user',
          },
          text: { type: 'string', example: 'What is this video about?' },
        },
      },
      Channel: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          name: { type: 'string', example: 'Channel Name' },
          ytChannelId: { type: 'string', example: 'UCxxxxxx' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['src/app.ts']; // Changed to app.ts since routes are now in GraphQL

swagger(outputFile, routes, doc);