// src/auth/jwt.ts
import jwt from "jsonwebtoken";
import type { IUser as User } from "../models/user.js";

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      googleId: user.googleId,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};