import jwt from 'jsonwebtoken';
import { UserData } from '../models/user.model';

const generateToken = (user: UserData) => {
  const expiresIn = '1d';
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign({ ...user}, secret, {
    expiresIn
  })
};

export default generateToken;