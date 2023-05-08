import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const generateToken = (user: Omit<IUser, 'password'>) => {
  const expiresIn = '1d';
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign({ ...user}, secret, {
    expiresIn
  })
};

export default generateToken;