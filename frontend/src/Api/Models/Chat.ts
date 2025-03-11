import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IChat {
  id: number;
  chatName: string;
  isGroupChat: boolean,
  users: IUser[],
  latestMessage?: IMessage,
  groupAdmin?: IUser,
  createdAt?: Date,
  updatedAt?: Date
}