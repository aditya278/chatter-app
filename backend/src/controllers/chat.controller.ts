import { Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import { CustomisedRequest } from '../models/interfaces/request.interface';
import * as chatService from '../services/chat.service';

export const accessChat = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new ErrorHandler('UserId param not sent with request', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const chat = await chatService.accessChat({
      userId: req.user.id,
      receiverId: parseInt(userId)
    });

    res.status(200).json(chat);
  }
  catch (err) {
    next(err);
  }
};

export const fetchChats = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const chats = await chatService.getChats(req.user.id);

    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};

export const createGroupChat = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      throw new ErrorHandler('Please fill all the fields', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    // Parse users if it's a string
    const userIds = typeof users === 'string' ? JSON.parse(users) : users;

    if (!Array.isArray(userIds) || userIds.length < 2) {
      throw new ErrorHandler('More than 2 users are required to form a group chat', 400);
    }

    const groupChat = await chatService.createGroupChat({
      name,
      userIds: userIds.map((id: string) => parseInt(id)),
      adminId: req.user.id
    });

    res.status(200).json(groupChat);
  } catch (err) {
    next(err);
  }
};

export const renameGroup = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      throw new ErrorHandler('Please provide chat ID and new name', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const updatedChat = await chatService.renameGroupChat({
      chatId: parseInt(chatId),
      name: chatName,
      adminId: req.user.id
    });

    res.status(200).json(updatedChat);
  }
  catch (err) {
    next(err);
  }
};

export const addToGroup = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      throw new ErrorHandler('Please provide chat ID and user ID', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const updatedChat = await chatService.addUserToGroup({
      chatId: parseInt(chatId),
      userId: parseInt(userId),
      adminId: req.user.id
    });

    res.status(200).json(updatedChat);
  }
  catch (err) {
    next(err);
  }
};

export const removeFromGroup = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      throw new ErrorHandler('Please provide chat ID and user ID', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const updatedChat = await chatService.removeUserFromGroup({
      chatId: parseInt(chatId),
      userId: parseInt(userId),
      adminId: req.user.id
    });

    res.status(200).json(updatedChat);
  }
  catch (err) {
    next(err);
  }
};