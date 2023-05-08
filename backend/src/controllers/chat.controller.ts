import { Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import Message from '../models/message.model';
import Chat from '../models/chat.model';
import { CustomisedRequest } from '../models/interfaces/request.interface';
import User, { IUserDoc } from '../models/user.model';

export const accessChat = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    if (!userId) throw new ErrorHandler('UserId param not sent with request', 400);

    let message = new Message;

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ]
    }).populate('users', '-password')
      .populate({ path: 'latestMessage', populate: { path: 'sender', select: "name picture email" } });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = Chat.build({
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId]
      });

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');

      res.status(200).send(fullChat);
    }
  }
  catch (err) {
    console.log('Error: ', err);
    next(err);
  }
}

export const fetchChats = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results: any) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name picture email'
        });

        res.status(200).send(results);
      })

  } catch (err) {
    next(err);
  }
};

export const createGroupChat = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).send({ message: 'More than 2 users are required to form a group chat' });
    }

    users.push(req.user);

    const groupChatObj = Chat.build({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id
    });

    const groupChat = await Chat.create(groupChatObj);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password').populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (err) {
    console.log('Error: ', err);
    next(err);
  }
};

export const renameGroup = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  }
  catch (err) {
    console.log('Error: ', err);
    next(err);
  }
};

export const addToGroup = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  }
  catch (err) {
    console.log('Error: ', err);
    next(err);
  }
};

export const removeFromGroup = async (req: CustomisedRequest, res: Response, next: NextFunction) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  }
  catch (err) {
    console.log('Error: ', err);
    next(err);
  }
}