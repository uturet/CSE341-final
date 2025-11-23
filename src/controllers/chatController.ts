import type { Request, Response, NextFunction } from 'express';
import type { Chat } from '../models/chat'


/**
 * GET /chat
 * Return list of chats
 */
export async function getChats(req: Request, res: Response, next: NextFunction) {
  try {
    res.json([]);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /chat/:id
 * Return single chat by id
 */
export async function getChatById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Chat id is required' });
    }

    let chat = null;

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /chat
 * Create a new chat
 */
export async function createChat(req: Request, res: Response, next: NextFunction) {
  try {
    const { project_id, title, messages } = req.body as Partial<Chat>;

    if (!project_id) {
      return res.status(400).json({ message: 'Chat project_id is required and must be a non-empty string' });
    }

    const created = null

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /chat/:id
 * Update chat by id
 */
export async function updateChatById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, messages } = req.body as Partial<Chat>;

    if (!id) {
      return res.status(400).json({ message: 'Chat id is required' });
    }

    let chat = null;
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.json(chat);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /chat/:id
 * Delete a chat by id
 */
export async function deleteChatById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Chat id is required' });
    }

    let chat = null;

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
