import { IChat } from "./Chat";
import { IUser } from "./User";

export interface IMessage {
  sender: IUser,
  content: string;
  chat: IChat;
}