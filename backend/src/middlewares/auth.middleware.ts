import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { CustomisedRequest } from '../models/interfaces/request.interface';
import ErrorHandler from '../utils/errorHandler';

export const auth = async (req: any, res: Response, next: NextFunction) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];

      // decode token id
      const decode: IUser = jwt.verify(token, (process.env.JWT_SECRET || '')) as IUser;

      req.user = await User.findOne({ email: decode.email }).select('-password');
      next();
    }
    else {
      throw new ErrorHandler('Not Authorised', 401);
    }
  }
  catch (err) {
    console.log('Error', err);
    next(err);
  }
};