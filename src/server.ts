import app from "./app";
import connectDB from "./db/connection";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const startServer = async () => {
  await connectDB(); // Ensure DB connection
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();