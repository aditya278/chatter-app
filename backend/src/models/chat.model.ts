import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import Message from './message.model';

export interface IChat {
  chatName: string;
  isGroupChat?: boolean,
  users: Types.ObjectId[],
  latestMessage?: Types.ObjectId[],
  groupAdmin?: Types.ObjectId
}

interface IChatDoc extends IChat, Document {
}

interface IChatModal extends Model<IChatDoc> {
  build(attr: IChat): IChatDoc
}

const ChatSchema: Schema = new Schema<IChat>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

ChatSchema.statics.build = (attr: IChat) => new Chat(attr);

const Chat = mongoose.model<IChatDoc, IChatModal>('Chat', ChatSchema);

export default Chat;