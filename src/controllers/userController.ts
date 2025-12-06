// src/controllers/userController.ts
import type { Request, Response, NextFunction } from 'express';
import type { IUser as User } from '../models/user'


/**
 * PUT /user/:id
 * Update user
 */
export async function updateUser(req: Request, res: Response, next: NextFunction) {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Update current user'
  */

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
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete current user'
  */

  try {

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
