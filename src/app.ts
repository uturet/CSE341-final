// src/app.ts
import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/", router);

export default app;