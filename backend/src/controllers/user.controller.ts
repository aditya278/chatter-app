import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import { CustomisedRequest } from '../models/interfaces/request.interface';
import * as userService from '../services/user.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) {
      throw new ErrorHandler('Please enter all the fields', 400);
    }

    const user = await userService.registerUser({ name, email, password, picture });
    
    res.status(201).json(user);
  }
  catch (err) {
    next(err);
  }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorHandler('Please enter all the fields', 400);
    }

    const user = await userService.authenticateUser({ email, password });
    
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * /api/user?search=aditya
 * @param req 
 * @param res 
 * @param next 
 */
export const searchUser = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const searchTerm = req.query.search as string;
    const currentUserEmail = req.user?.email;
    
    const users = await userService.searchUsers(searchTerm, currentUserEmail);
    
    res.json(users);
  }
  catch(err) {
    next(err);
  }
};