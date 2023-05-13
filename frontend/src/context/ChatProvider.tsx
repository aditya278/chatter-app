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
}

const ChatContext = createContext<IChatData | null>(null);

const ChatProvider = ({ children }: any) => {

  const [user, setUser] = useState<IUser>();
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const [chats, setChats] = useState<IChat[]>([])

  const history = useHistory();

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

  return <ChatContext.Provider value={{user, selectedChat, setSelectedChat, chats, setChats}}>{children}</ChatContext.Provider>
}

export const useChatContext = () => {
  const context = useContext(ChatContext) as IChatData;
  if (context === null) {
    throw new Error('useChatContext must be used within a ChatProvider component');
  }

  return context;
}

export default ChatProvider;