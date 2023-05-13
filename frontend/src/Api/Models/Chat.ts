import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IChat {
  _id: string;
  chatName: string;
  isGroupChat?: boolean,
  users: IUser[],
  latestMessage?: IMessage[],
  groupAdmin?: IUser
}