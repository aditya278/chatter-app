import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import User, { IUser, IUserDoc } from '../models/user.model';
import generateToken from '../config/generateToken';
import { MD5 } from 'crypto-js';
import { CustomisedRequest } from '../models/interfaces/request.interface';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) throw new ErrorHandler('Please enter all the fields', 400);

    const userExists: IUser | null = await User.findOne({ email });

    if (userExists) throw new ErrorHandler('User already exists', 400);

    const userObj: IUser = User.build({
      name,
      email,
      password,
      picture: `http://www.gravatar.com/avatar/${MD5(email).toString()}`,
    });

    const user = await User.create(userObj);

    if (!user) throw new ErrorHandler('Failed to create the user', 400);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: user.token,
    });
  }
  catch (err) {
    next(err);
  }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user: IUserDoc | null = await User.findOne({ email });

    if (!user) throw new ErrorHandler('No such user exists', 401);

    if (!(await user.matchPassword(password))) throw new ErrorHandler('Invalid Credentials', 401);

    const userDataWithoutPassword = { name: user.name, email: user.email, picture: user.picture, _id: user._id };
    const token = generateToken(userDataWithoutPassword);
    res.json({ ...userDataWithoutPassword, token });

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
    const keyword = req.query ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i'}},
        { email: { $regex: req.query.search, $options: 'i'}},
      ]
    } : {};

    console.log('Req User: ', req.user);
    const users = await User.find(keyword).find({ email: { $ne: req?.user?.email }});
    res.send(users);
  }
  catch(err) {
    next(err);
  }
};