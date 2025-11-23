import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen({ openapi: "3.0.0" });

const doc = {
  info: {
    title: 'Chat with Youtube Videos',
    description: 'API for chatting with youtube videos',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local server' },
  ],
};

const outputFile = './swagger-output.json';
const routes = ['./routes.mts'];

swagger(outputFile, routes, doc);
