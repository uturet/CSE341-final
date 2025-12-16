// src/server.ts
import app from "./app.js";
import connectDB from "./db/connection.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const startServer = async () => {
  await connectDB(); // Ensure DB connection
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL API available at http://localhost:${PORT}/graphql`);
    console.log(`GraphiQL interface at http://localhost:${PORT}/graphiql`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();