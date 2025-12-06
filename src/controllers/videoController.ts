// src/controllers/videoController.ts
import type { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from "mongoose";
import type { IVideo as Video } from "../models/video";
import { VideoModel } from "../models/video";

/**
 * GET /video
 * Return list of videos
 *
 * Query params:
 *  - projectId (optional): filter by project
 *  - limit (optional): number
 *  - skip (optional): number
 */
export async function getVideos(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Videos']
    #swagger.summary = 'List videos'
  */
  try {
    const { projectId } = req.query as Record<string, string | undefined>;
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const skip = Number(req.query.skip ?? 0);

    const filter: Record<string, unknown> = {};
    if (projectId) {
      if (!mongoose.isValidObjectId(projectId)) {
        return res.status(400).json({ message: "Invalid projectId filter" });
      }
      filter.projectId = new Types.ObjectId(projectId);
    }

    const [videos, total] = await Promise.all([
      VideoModel.find(filter).skip(skip).limit(limit).exec(),
      VideoModel.countDocuments(filter).exec(),
    ]);

    return res.status(200).json({
      success: true,
      total,
      count: videos.length,
      data: videos,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /video/:id
 * Return single video by id
 */
export async function getVideoById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Videos']
    #swagger.summary = 'Get video by id'
  */
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Video id is required' });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid video id' });

    const video = await VideoModel.findById(id).exec();
    if (!video) return res.status(404).json({ message: 'Video not found' });

    return res.status(200).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /video
 * Create a new video
 */
export async function createVideo(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Videos']
    #swagger.summary = 'Create a new video'
  */
  try {
    const { projectId, ytVideoId } =
      req.body as Partial<Video & { projectId?: string }>;

    if (!projectId || typeof projectId !== "string" || projectId.trim() === "") {
      return res.status(400).json({ message: 'Video projectId is required and must be a non-empty string' });
    }
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'projectId is not a valid ObjectId' });
    }
    if (!ytVideoId || typeof ytVideoId !== "string" || ytVideoId.trim() === "") {
      return res.status(400).json({ message: 'ytVideoId is required and must be a non-empty string' });
    }

    const created = await VideoModel.create({
      projectId: new Types.ObjectId(projectId),
      ytVideoId: ytVideoId.trim(),
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /video/:id
 * Update video by id
 */
export async function updateVideoById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Videos']
    #swagger.summary = 'Update video by id'
  */
  try {
    const { id } = req.params;
    const { title, ytChannelId, ytVideoId, description, captions, length, views } = req.body as Partial<Video>;

    if (!id) return res.status(400).json({ message: 'Video id is required' });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid video id' });

    const update: Partial<Video> = {};
    if (typeof title === "string" && title.trim() !== "") update.title = title.trim();
    if (typeof ytChannelId === "string" && ytChannelId.trim() !== "") update.ytChannelId = ytChannelId.trim();
    if (typeof ytVideoId === "string" && ytVideoId.trim() !== "") update.ytVideoId = ytVideoId.trim();
    if (typeof description === "string") update.description = description.trim();
    if (typeof captions === "string") update.captions = captions.trim();
    if (typeof length === "number") update.length = length;
    if (typeof views === "number") update.views = views;

    const video = await VideoModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
    if (!video) return res.status(404).json({ message: 'Video not found' });

    return res.status(200).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /video/:id
 * Delete video by id
 */
export async function deleteVideoById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Videos']
    #swagger.summary = 'Delete video by id'
  */
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Video id is required' });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid video id' });

    const video = await VideoModel.findByIdAndDelete(id).exec();
    if (!video) return res.status(404).json({ message: 'Video not found' });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
