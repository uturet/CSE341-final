// src/app.ts
import express from "express";
import cors from "cors";
import passport from './auth/passport.js'
import { createHandler } from 'graphql-http/lib/use/express';
import schema from "./graphql/schema.js";
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './auth/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Load Swagger documentation
let swaggerDocument;
try {
  const swaggerPath = join(__dirname, '..', 'swagger-output.json');
  swaggerDocument = JSON.parse(readFileSync(swaggerPath, 'utf8'));
} catch (error) {
  console.warn('Swagger documentation not found. Run "pnpm swagger" to generate it.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());

// Swagger UI
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Chat with YouTube Videos API',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
}

// Auth routes
app.use('/auth', authRoutes);

// GraphQL endpoint
app.all('/graphql', (req, res, next) => {
  createHandler({ 
    schema,
    context: async () => {
      const authHeader = req.headers.authorization;
      const context: any = {};
      
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.substring(7);
          const jwt = await import('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          context.user = decoded;
        } catch (error) {
          // Invalid token, context.user remains undefined
        }
      }
      
      return context;
    }
  })(req, res, next);
});

// GraphiQL interface
if (process.env.NODE_ENV !== "production")
  app.get('/graphiql', (_req, res) => {
    res.type('html');
    res.end(`<!DOCTYPE html>
  <html>
    <head>
      <title>GraphiQL</title>
      <style>
        body {
          height: 100%;
          margin: 0;
          width: 100%;
          overflow: hidden;
        }
        #graphiql {
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <div id="graphiql">Loading...</div>
      <script
        crossorigin
        src="https://unpkg.com/react@17/umd/react.production.min.js"
      ></script>
      <script
        crossorigin
        src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
      ></script>
      <link rel="stylesheet" href="https://unpkg.com/graphiql@2.4.7/graphiql.min.css" />
      <script
        crossorigin
        src="https://unpkg.com/graphiql@2.4.7/graphiql.min.js"
      ></script>
      <script>
        const fetcher = GraphiQL.createFetcher({
          url: '/graphql',
        });
        
        ReactDOM.render(
          React.createElement(GraphiQL, { fetcher: fetcher }),
          document.getElementById('graphiql'),
        );
      </script>
    </body>
  </html>`);
  });

export default app;