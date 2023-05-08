import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IMessage {
  sender: IUser,
  content: string;
  chat: Types.ObjectId;
}

interface IMessageDoc extends IMessage, Document {
}

interface IMessageModel extends Model<IMessageDoc> {
  build(attr: IMessage): IMessageDoc;
}

const MessageSchema: Schema = new mongoose.Schema<IMessage>({
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

MessageSchema.statics.build = (attr: IMessage) => new Message(attr);

const Message = mongoose.model<IMessageDoc, IMessageModel>('Message', MessageSchema);

export default Message;