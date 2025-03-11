import jwt from 'jsonwebtoken';
import { UserData } from '../db/schema';

/**
 * Generate a JWT token for a user
 * @param user The user data to include in the token
 * @returns The generated JWT token
 */
export const generateToken = (user: Partial<UserData>): string => {
  const expiresIn = '1d';
  const secret = process.env.JWT_SECRET || '';
  
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
  }
  
  return jwt.sign({ ...user }, secret, {
    expiresIn
  });
}; 