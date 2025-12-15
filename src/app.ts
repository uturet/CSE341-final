// src/app.ts
import express from "express";
import cors from "cors";
import passport from './auth/passport.js'
import { createHandler } from 'graphql-http/lib/use/express';
import router from "./routes.js";
import errorHandler from "./middleware/errorHandler.js";
import schema from "./graphql/schema.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());


// GraphQL endpoint
app.all('/graphql', createHandler({ schema }));

// GraphiQL interface
app.get('/', (_req, res) => {
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

// REST Routes
app.use("/api", router);

// Middleware
app.use(errorHandler);

export default app;