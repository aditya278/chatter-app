import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IUser, UserData } from './user.model';
import { ChatData, IChat } from './chat.model';

export type MessageData = {
  _id: string;
  sender: UserData;
  content: string;
  chat: ChatData;
};

export interface IMessageDoc extends Document {
  sender: Types.ObjectId,
  content: string;
  chat: Types.ObjectId;
}

interface IMessageModel extends Model<IMessageDoc> {
  build(attr: IMessageDoc): IMessageDoc;
}

const MessageSchema: Schema = new mongoose.Schema<IMessageDoc>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    trim: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
}, {
  timestamps: true
})

MessageSchema.statics.build = (attr: IMessageDoc) => new Message(attr);

const Message = mongoose.model<IMessageDoc, IMessageModel>('Message', MessageSchema);

export default Message;