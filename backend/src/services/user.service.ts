import { db } from '../db';
import { users } from '../db/schema';
import { eq, like, or, and, not } from 'drizzle-orm';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/token';
import { MD5 } from 'crypto-js';
import ErrorHandler from '../utils/errorHandler';

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  picture?: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface UserOutput {
  id: number;
  name: string;
  email: string;
  picture: string;
  token: string;
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns The newly created user with token
 */
export const registerUser = async (userData: RegisterUserInput): Promise<UserOutput> => {
  const { name, email, password, picture } = userData;

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length > 0) {
    throw new ErrorHandler('User already exists', 400);
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const [newUser] = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    picture: picture || `http://www.gravatar.com/avatar/${MD5(email).toString()}`
  }).returning();

  if (!newUser) {
    throw new ErrorHandler('Failed to create the user', 400);
  }

  // Generate token
  const userInfo = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    picture: newUser.picture
  };

  const token = generateToken(userInfo);

  return {
    ...userInfo,
    token
  };
};

/**
 * Authenticate a user
 * @param loginData User login data
 * @returns The authenticated user with token
 */
export const authenticateUser = async (loginData: LoginUserInput): Promise<UserOutput> => {
  const { email, password } = loginData;

  // Find the user
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    throw new ErrorHandler('No such user exists', 401);
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ErrorHandler('Invalid Credentials', 401);
  }

  // Generate token
  const userInfo = {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture
  };

  const token = generateToken(userInfo);

  return {
    ...userInfo,
    token
  };
};

/**
 * Search for users
 * @param searchTerm Search term
 * @param currentUserEmail Current user's email to exclude from results
 * @returns Array of users matching the search term
 */
export const searchUsers = async (searchTerm: string, currentUserEmail?: string) => {
  if (!searchTerm) {
    return [];
  }

  // Search for users
  const searchResults = await db.select().from(users)
    .where(
      and(
        or(
          like(users.name, `%${searchTerm}%`),
          like(users.email, `%${searchTerm}%`)
        ),
        // Exclude the current user
        currentUserEmail ? not(eq(users.email, currentUserEmail)) : undefined
      )
    );

  return searchResults.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture
  }));
}; 