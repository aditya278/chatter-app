import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IChat {
  chatName: string;
  isGroupChat?: boolean,
  users: IUser[],
  latestMessage?: IMessage[],
  groupAdmin?: IUser
}