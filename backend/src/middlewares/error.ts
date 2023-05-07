import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';

const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  res.status(err.statusCode).json({ error: err.message });
};

export default errorMiddleware;