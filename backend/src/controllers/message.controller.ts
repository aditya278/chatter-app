import { Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import Message from '../models/message.model';
import { CustomisedRequest } from '../models/interfaces/request.interface';
import User from '../models/user.model';
import Chat from '../models/chat.model';


export const sendMessage = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) throw new ErrorHandler('Invalid data passed into request', 400);

    let message = await Message.create({
      sender: req?.user?._id,
      content,
      chat: chatId
    });

    message = await message.populate('sender', 'name email picture')
    message = await message.populate('chat');
    await User.populate(message, {
      path: 'chat.users',
      select: 'name picture email'
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message
    });

    res.json(message);
  }
  catch (err) {
    console.log('Error: ', err);
    next(err);
  }
};

export const allMessages = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    if (!chatId) throw new ErrorHandler('Invalid data passed into request', 400);

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name picture email")
      .populate("chat");
    res.json(messages);
  }
  catch (err) {
    console.log('Error: ', err);
    next(err);
  }
};