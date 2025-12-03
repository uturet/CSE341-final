// src/controllers/projectController.ts
import type { Request, Response, NextFunction } from 'express';
import type { IProject as Project } from '../models/project'


/**
 * GET /project/:id/status
 * Return current captions extractions status by project id
 */
export async function getStatus(req: Request, res: Response, next: NextFunction) {
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
 */
export async function getProjects(req: Request, res: Response, next: NextFunction) {
  try {
    res.json([]);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /project/:id
 * Return single project by id
 */
export async function getProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Project id is required' });
    }

    let project = null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /project
 * Create a new project
 */
export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { title } = req.body as Partial<Project>;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Project title is required and must be a non-empty string' });
    }

    const created = null

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /project/:id
 * Update project by id
 */
export async function updateProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title } = req.body as Partial<Project>;

    if (!id) {
      return res.status(400).json({ message: 'Project id is required' });
    }

    let project = null;
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /project/:id
 * Delete a project by id
 */
export async function deleteProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Project id is required' });
    }

    let project = null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
