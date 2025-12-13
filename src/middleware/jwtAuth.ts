import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type { IUser as User } from "../models/user";

const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization token is missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization token should start with Bearer" });
    }

    const token = authHeader.substring(7); // Remove "Bearer " from string
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as User;

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default jwtAuthMiddleware