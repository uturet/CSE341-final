// src/controllers/projectController.ts
import type { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import type { IProject as Project } from "../models/project";
import { ProjectModel } from "../models/project";

/**
 * GET /project/:id/status
 * Return current captions extractions status by project id
 */
export async function getStatus(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Projects']
    #swagger.summary = 'Get current captions/extractions status for project'
  */

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Status id is required' });
    }

    let status = null;

    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    res.json(status);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /project
 * Return list of projects
 *
 * Query params:
 *  - userId (optional): filter by owner
 *  - limit (optional): number
 *  - skip (optional): number
 */
export async function getProjects(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Projects']
    #swagger.summary = 'List projects'
  */

  try {
    const { userId } = req.query as Record<string, string | undefined>;
    const limit = Math.min(Number(req.query.limit ?? 50), 100); // default 50, max 100
    const skip = Number(req.query.skip ?? 0);

    const filter: Record<string, unknown> = {};
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid userId filter" });
      }
      filter.userId = new Types.ObjectId(userId);
    }

    const [projects, total] = await Promise.all([
      ProjectModel.find(filter).skip(skip).limit(limit).exec(),
      ProjectModel.countDocuments(filter).exec(),
    ]);

    return res.status(200).json({
      success: true,
      total,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /project/:id
 * Return single project by id
 */
export async function getProjectById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Projects']
    #swagger.summary = 'Get project by id'
  */

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await ProjectModel.findById(id).exec();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /project
 * Create a new project
 */
export async function createProject(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Projects']
    #swagger.summary = 'Create a project'
  */

  try {
    const { userId, title, description } = req.body as Partial<Project & { userId?: string }>;

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ message: "userId is required and must be a non-empty string" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "userId is not a valid ObjectId" });
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "Project title is required and must be a non-empty string" });
    }

    const created = await ProjectModel.create({
      userId: new Types.ObjectId(userId),
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : undefined,
    });

    return res.status(201).json({
      success: true,
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /project/:id
 * Update project by id
 */
export async function updateProjectById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Projects']
    #swagger.summary = 'Update project by id'
  */

  try {
    const { id } = req.params;
    const { title, description } = req.body as Partial<Project>;

    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const update: Partial<Project> = {};
    if (typeof title === "string" && title.trim() !== "") update.title = title.trim();
    if (typeof description === "string") update.description = description.trim();

    const project = await ProjectModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /project/:id
 * Delete a project by id
 */
export async function deleteProjectById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Projects']
    #swagger.summary = 'Delete project by id'
  */

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Project id is required" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await ProjectModel.findByIdAndDelete(id).exec();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
