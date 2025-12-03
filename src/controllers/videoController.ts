// src/controllers/videoController.ts
import type { Request, Response, NextFunction } from 'express';
import type { IVideo as Video } from '../models/video'


/**
 * GET /video
 * Return list of videos
 */
export async function getVideos(req: Request, res: Response, next: NextFunction) {
  try {
    res.json([]);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /video/:id
 * Return single video by id
 */
export async function getVideoById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Video id is required' });
    }

    let video = null;

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /video
 * Create a new video
 */
export async function createVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, ytVideoId } = req.body as Partial<Video>;

    if (!ytVideoId || typeof ytVideoId !== 'string' || ytVideoId.trim() === '') {
      return res.status(400).json({ message: 'Project ytVideoId is required and must be a non-empty string' });
    }

    if (!projectId) {
      return res.status(400).json({ message: 'Video projectId is required and must be a non-empty string' });
    }

    const created = null

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /video/:id
 * Update video by id
 */
export async function updateVideoById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, ytChannelId, description, captions, length, views } = req.body as Partial<Video>;

    if (!id) {
      return res.status(400).json({ message: 'Video id is required' });
    }

    let video = null;
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.json(video);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /video/:id
 * Delete a video by id
 */
export async function deleteVideoById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Video id is required' });
    }

    let video = null;

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
