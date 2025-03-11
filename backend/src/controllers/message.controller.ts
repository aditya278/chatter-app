import { Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import { CustomisedRequest } from '../models/interfaces/request.interface';
import * as messageService from '../services/message.service';

export const sendMessage = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      throw new ErrorHandler('Invalid data passed into request', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const message = await messageService.sendMessage({
      content,
      chatId: parseInt(chatId),
      senderId: req.user.id
    });

    res.status(200).json(message);
  }
  catch (err) {
    next(err);
  }
};

export const allMessages = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    
    if (!chatId) {
      throw new ErrorHandler('Invalid data passed into request', 400);
    }

    if (!req.user?.id) {
      throw new ErrorHandler('User not authenticated', 401);
    }

    const messages = await messageService.getMessages(
      parseInt(chatId),
      req.user.id
    );
    
    res.status(200).json(messages);
  }
  catch (err) {
    next(err);
  }
};