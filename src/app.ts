// src/app.ts
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import schema from "./graphql/schema.js";
import { buildContext } from "./graphql/context.js";
import authRoutes from "./auth/authRoutes.js";
import passport from "passport";
import "./auth/passport.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use("/auth", authRoutes);

const server = new ApolloServer({
  schema,
});

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => buildContext(req),
  })
);

export default app;