import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomisedRequest, UserInfo } from '../models/interfaces/request.interface';
import ErrorHandler from '../utils/errorHandler';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const auth = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];

      // decode token id
      const decoded = jwt.verify(token, (process.env.JWT_SECRET || '')) as UserInfo;

      // Find user in database
      const [user] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        picture: users.picture
      })
      .from(users)
      .where(eq(users.email, decoded.email));

      if (!user) {
        throw new ErrorHandler('User not found', 401);
      }

      req.user = user;
      next();
    }
    else {
      throw new ErrorHandler('Not Authorized', 401);
    }
  }
  catch (err) {
    next(new ErrorHandler('Not Authorized, token failed', 401));
  }
};