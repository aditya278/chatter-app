import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';

type ErrorResponse = {
  error: string;
  stack?: string;
}

export const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  
  let errorResponse: ErrorResponse = {
    error: err.message
  };

  'production' !== process.env.NODE_ENV && (errorResponse.stack = err.stack);
  res.status(err.statusCode).json(errorResponse);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};