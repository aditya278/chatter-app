import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';

export const listUsers = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const isError = true;

    if (isError) throw new ErrorHandler('Error Encountered!', 400);

    const users = ['John', 'Doe', 'Wick'];
    res.status(200).send(users);
  }
  catch (err) {
    next(err);
  }
}