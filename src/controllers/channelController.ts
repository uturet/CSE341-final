// src/controllers/channelController.ts
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import type { IChannel as Channel } from "../models/channel";
import { ChannelModel } from "../models/channel";
import connectDB from "../db/connection";


/**
 * GET /channel
 * Return list of channels
 */
export async function getChannels(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Channels']
    #swagger.summary = 'Return list of channels'
  */

  try {
    const channels = await ChannelModel.find().exec();
    res.status(200).json({
      success: true,
      count: channels.length,
      data: channels,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /channel/:id
 * Return single channel by id
 */
export async function getChannelById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Channels']
    #swagger.summary = 'Return single channel by id'
  */

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Channel id is required" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid channel id" });
    }

    const channel = await ChannelModel.findById(id).exec();

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /channel
 * Create a new channel
 */
export async function createChannel(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Channels']
    #swagger.summary = 'Create a new channel'
  */

  try {
    const { projectId, name, ytChannelId } = req.body as Partial<Channel & {
      projectId?: string;
    }>;

    if (
      !ytChannelId ||
      typeof ytChannelId !== "string" ||
      ytChannelId.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "ytChannelId is required and must be a non-empty string" });
    }

    if (!projectId || typeof projectId !== "string" || projectId.trim() === "") {
      return res
        .status(400)
        .json({ message: "projectId is required and must be a non-empty string" });
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: "projectId is not a valid ObjectId" });
    }

    const created = await ChannelModel.create({
      projectId: new mongoose.Types.ObjectId(projectId),
      name: typeof name === "string" ? name : undefined,
      ytChannelId: ytChannelId.trim(),
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
 * PUT /channel/:id
 * Update channel by id
 */
export async function updateChannelById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Channels']
    #swagger.summary = 'Update channel by id'
  */

  try {
    const { id } = req.params;
    const { name, ytChannelId, projectId } = req.body as Partial<
      Channel & { projectId?: string }
    >;

    if (!id) {
      return res.status(400).json({ message: "Channel id is required" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid channel id" });
    }

    const update: Partial<Channel> = {};
    if (typeof name === "string") update.name = name;
    if (typeof ytChannelId === "string" && ytChannelId.trim() !== "")
      update.ytChannelId = ytChannelId.trim();
    if (typeof projectId === "string" && projectId.trim() !== "") {
      if (!mongoose.isValidObjectId(projectId)) {
        return res.status(400).json({ message: "projectId is not a valid ObjectId" });
      }
      update.projectId = new mongoose.Types.ObjectId(projectId);
    }

    // find and update
    const channel = await ChannelModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /channel/:id
 * Delete a channel by id
 */
export async function deleteChannelById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Channels']
    #swagger.summary = 'Delete a channel by id'
  */

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Channel id is required" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid channel id" });
    }

    const channel = await ChannelModel.findByIdAndDelete(id).exec();

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Successfully deleted
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
