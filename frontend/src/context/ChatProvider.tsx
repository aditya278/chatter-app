import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IUser } from "../Api/Models/User";
import { IChat } from "../Api/Models/Chat";

interface IChatData {
  user?: IUser;
  selectedChat?: IChat;
  setSelectedChat: React.Dispatch<React.SetStateAction<IChat | undefined>>;
  chats: IChat[];
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
  sortChats: (chatsToSort: IChat[]) => IChat[];
}

// Utility function to sort chats by updatedAt timestamp (newest first)
const sortChatsByDate = (chatsToSort: IChat[]): IChat[] => {
  return [...chatsToSort].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });
};

const ChatContext = createContext<IChatData | null>(null);

const ChatProvider = ({ children }: any) => {
  const [user, setUser] = useState<IUser>();
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const [chats, setChats] = useState<IChat[]>([]);

  const history = useHistory();

  // Wrapper function to ensure chats are always sorted
  const sortChats = (chatsToSort: IChat[]): IChat[] => {
    return sortChatsByDate(chatsToSort);
  };

  useEffect(() => {
    if (!history) return;
    const _userInfo = localStorage.getItem('userInfo');
    if (!_userInfo) {
      setUser(undefined);
      history.push('/');
      return;
    }

    const userInfo = JSON.parse(_userInfo);
    setUser(userInfo);
    history.push('/chats');
  }, [history]);

  return (
    <ChatContext.Provider 
      value={{
        user, 
        selectedChat, 
        setSelectedChat, 
        chats, 
        setChats,
        sortChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext) as IChatData;
  if (context === null) {
    throw new Error('useChatContext must be used within a ChatProvider component');
  }

  return context;
}

export default ChatProvider;