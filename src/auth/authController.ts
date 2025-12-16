// src/auth/auth.controller.ts
import type { Request, Response, NextFunction } from "express";
import { generateToken } from "./jwt";
import type { IUser as User} from "../models/user.js";

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};