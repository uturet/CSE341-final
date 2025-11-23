import type { Request, Response, NextFunction } from 'express';
import type { User } from '../models/user'


/**
 * PUT /user/:id
 * Update user
 */
export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {

        return res.json({});
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /user/:id
 * Delete a user
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
}
