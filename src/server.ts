// src/server.ts
import app from "./app.js";
import connectDB from "./db/connection.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL API & Docs at http://localhost:${PORT}/graphql`);
  });
};

startServer();