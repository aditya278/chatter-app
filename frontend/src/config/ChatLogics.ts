import { IMessage } from "../Api/Models/Message";
import { IUser } from "../Api/Models/User";

export const getSender = (users: IUser[], loggedUser?: IUser, fullUser = false) => {
  const user: IUser = users.find(user => user.email !== loggedUser?.email) ?? users[0];
  if (!fullUser)
    return user.name;
  return user;
}

export const isSameSender = (messages: IMessage[], currentMsg: IMessage, currentMsgIdx: number, currentUserEmail: string) => {
  return (
    currentMsgIdx < messages.length - 1 && 
    (messages[currentMsgIdx + 1].sender._id !== currentMsg.sender._id || messages[currentMsgIdx + 1].sender._id === undefined) && messages[currentMsgIdx].sender.email !== currentUserEmail
  );
};

export const isLastMessage = (messages: IMessage[], idx: number, currentUserEmail: string) => {
  return (
    idx === messages.length - 1 &&
    messages[messages.length - 1].sender.email !== currentUserEmail &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages: IMessage[], m: IMessage, i: number, currentUserEmail: string) => {
  const hasNextMessage = i < messages.length - 1;
  const isSameSender = messages[i + 1]?.sender._id === m.sender._id;
  const isCurrentUser = messages[i]?.sender.email === currentUserEmail;

  if (hasNextMessage && isSameSender && !isCurrentUser) {
    return 33;
  } else if (
    (hasNextMessage && !isSameSender && !isCurrentUser) ||
    (!hasNextMessage && !isCurrentUser)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameUser = (messages: IMessage[], message: IMessage, idx: number) => {
  return idx > 0 && messages[idx - 1].sender._id === message.sender._id;
}