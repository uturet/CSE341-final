// src/models/project.ts
import { Schema, model, Types } from "mongoose";

export interface IProject {
  userId: Types.ObjectId;
  title: string;
  description?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const ProjectModel = model<IProject>("Project", ProjectSchema, "projects");
