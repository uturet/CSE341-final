// src/models/user.ts
import { Schema, model } from "mongoose";

export interface IUser {
  googleId: string;
  email: string;
  name?: string;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema, "users");
