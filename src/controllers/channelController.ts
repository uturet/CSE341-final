import type { Request, Response, NextFunction } from 'express';
import type { Channel } from '../models/channel';


/**
 * GET /channel
 * Return list of channels
 */
export async function getChannels(req: Request, res: Response, next: NextFunction) {
  try {
    res.json([]);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /channel/:id
 * Return single channel by id
 */
export async function getChannelById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Channel id is required' });
    }

    let channel = null;

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /channel
 * Create a new channel
 */
export async function createChannel(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, ytid } = req.body as Partial<Channel>;

    if (!ytid || typeof ytid !== 'string' || ytid.trim() === '') {
      return res.status(400).json({ message: 'Channel name is required and must be a non-empty string' });
    }

    const created = null

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /channel/:id
 * Update channel by id
 */
export async function updateChannelById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, ytid } = req.body as Partial<Channel>;

    if (!id) {
      return res.status(400).json({ message: 'Channel id is required' });
    }

    let channel = null;
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    return res.json(channel);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /channel/:id
 * Delete a channel by id
 */
export async function deleteChannelById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Channel id is required' });
    }

    let channel = null;

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
