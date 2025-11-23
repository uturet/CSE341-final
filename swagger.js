// swagger.js
import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen({ openapi: "3.0.0" });

const doc = {
  info: {
    title: 'Chat with Youtube Videos',
    description: 'API for chatting with YouTube videos',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local server' },
  ],
  tags: [
    { name: 'Users', description: 'Operations about users' },
    { name: 'Projects', description: 'Operations about projects' },
    { name: 'Chats', description: 'Operations about chats' },
    { name: 'Videos', description: 'Operations about videos' },
    { name: 'Channels', description: 'Operations about channels' },
  ],
};

const outputFile = './swagger-output.json';
const routes = ['./routes.ts'];

swagger(outputFile, routes, doc);