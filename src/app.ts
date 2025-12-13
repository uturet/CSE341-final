// src/app.ts
import express from "express";
import cors from "cors";
import passport from './auth/passport.js'
import router from "./routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());


// Routes
app.use("/", router);

// Middleware
app.use(errorHandler);

export default app;