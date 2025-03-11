import { IChat } from "./Chat";
import { IUser } from "./User";

export interface IMessage {
  id?: number;
  sender: IUser,
  content: string;
  chat: IChat;
  createdAt?: Date;
  updatedAt?: Date;
}