// src/db/connection.ts
import dotenv from "dotenv";
dotenv.config();

import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log('Database connected');
  } catch (err) {
    if (err instanceof Error) {
        console.error('Database connection error:', err.message);
    } else {
        console.error('Unknown error:', err);
    }
    process.exit(1); // terminates the server
  }
};

export default connectDB;