import { IMessage } from "../Api/Models/Message";
import { IUser } from "../Api/Models/User";

/**
 * Gets the name of the other user in a one-on-one chat
 * @param loggedUser The currently logged-in user
 * @param users Array of users in the chat
 * @returns The name of the other user, or empty string if not found
 */
export const getSender = (loggedUser: IUser | undefined, users: IUser[] | any) => {
  // Handle edge cases: no logged user, no users array, or empty array
  if (!loggedUser || !users) return "";
  
  // Ensure users is an array
  if (!Array.isArray(users) || users.length === 0) return "";
  
  try {
    // Find the other user in the chat (not the logged-in user)
    const otherUser = users.find((u: IUser) => u && u.id !== loggedUser.id);
    return otherUser ? otherUser.name : users[0]?.name || "";
  } catch (error) {
    console.error("Error in getSender:", error);
    return "";
  }
}

/**
 * Gets the full user object of the other user in a one-on-one chat
 * @param loggedUser The currently logged-in user
 * @param users Array of users in the chat
 * @returns The user object of the other user, or null if not found
 */
export const getSenderFull = (loggedUser: IUser | undefined, users: IUser[] | any) => {
  // Handle edge cases: no logged user, no users array, or empty array
  if (!loggedUser || !users) return null;
  
  // Ensure users is an array
  if (!Array.isArray(users) || users.length === 0) return null;
  
  try {
    // Find the other user in the chat (not the logged-in user)
    const otherUser = users.find((u: IUser) => u && u.id !== loggedUser.id);
    return otherUser || users[0] || null;
  } catch (error) {
    console.error("Error in getSenderFull:", error);
    return null;
  }
}

export const isSameSender = (messages: IMessage[], currentMsg: IMessage, currentMsgIdx: number, currentUserEmail: string) => {
  return (
    currentMsgIdx < messages.length - 1 && 
    (messages[currentMsgIdx + 1].sender.id !== currentMsg.sender.id || messages[currentMsgIdx + 1].sender.id === undefined) && messages[currentMsgIdx].sender.email !== currentUserEmail
  );
};

export const isLastMessage = (messages: IMessage[], idx: number, currentUserEmail: string) => {
  return (
    idx === messages.length - 1 &&
    messages[messages.length - 1].sender.email !== currentUserEmail &&
    messages[messages.length - 1].sender.id
  );
};

export const isSameSenderMargin = (messages: IMessage[], m: IMessage, i: number, currentUserEmail: string) => {
  const hasNextMessage = i < messages.length - 1;
  const isSameSender = messages[i + 1]?.sender.id === m.sender.id;
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
  return idx > 0 && messages[idx - 1].sender.id === message.sender.id;
}