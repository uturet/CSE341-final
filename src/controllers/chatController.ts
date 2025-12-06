// src/controllers/chatController.ts
import type { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from "mongoose";
import type { IChat as Chat } from "../models/chat";
import { ChatModel } from "../models/chat";

/**
 * GET /chat
 * Return list of chats
 *
 * Query params:
 *  - projectId (optional): filter by project
 *  - limit (optional): number
 *  - skip (optional): number
 */
export async function getChats(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Chats']
    #swagger.summary = 'List chats'
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

    const [chats, total] = await Promise.all([
      ChatModel.find(filter).skip(skip).limit(limit).exec(),
      ChatModel.countDocuments(filter).exec(),
    ]);

    return res.status(200).json({
      success: true,
      total,
      count: chats.length,
      data: chats,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /chat/:id
 * Return single chat by id
 */
export async function getChatById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Chats']
    #swagger.summary = 'Get chat by id'
  */
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Chat id is required' });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid chat id' });

    const chat = await ChatModel.findById(id).exec();
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    return res.status(200).json({ success: true, data: chat });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /chat
 * Create a new chat
 */
export async function createChat(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Chats']
    #swagger.summary = 'Create a new chat'
  */
  try {
    const { projectId, title, messages } = req.body as Partial<Chat & { projectId?: string }>;

    if (!projectId || typeof projectId !== "string" || projectId.trim() === "") {
      return res.status(400).json({ message: 'Chat projectId is required and must be a non-empty string' });
    }
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'projectId is not a valid ObjectId' });
    }

    const created = await ChatModel.create({
      projectId: new Types.ObjectId(projectId),
      title: typeof title === "string" ? title.trim() : undefined,
      messages: Array.isArray(messages) ? messages : [],
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /chat/:id
 * Update chat by id
 */
export async function updateChatById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Chats']
    #swagger.summary = 'Update chat by id'
  */
  try {
    const { id } = req.params;
    const { title, messages } = req.body as Partial<Chat>;

    if (!id) return res.status(400).json({ message: 'Chat id is required' });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid chat id' });

    const update: Partial<Chat> = {};
    if (typeof title === "string" && title.trim() !== "") update.title = title.trim();
    if (Array.isArray(messages)) update.messages = messages;

    const chat = await ChatModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    return res.status(200).json({ success: true, data: chat });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /chat/:id
 * Delete chat by id
 */
export async function deleteChatById(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Chats']
    #swagger.summary = 'Delete chat by id'
  */
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Chat id is required' });
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid chat id' });

    const chat = await ChatModel.findByIdAndDelete(id).exec();
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
