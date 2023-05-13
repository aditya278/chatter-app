import { IChat } from "./Chat";
import { IUser } from "./User";

export interface IMessage {
  _id?: string;
  sender: IUser,
  content: string;
  chat: IChat;
}