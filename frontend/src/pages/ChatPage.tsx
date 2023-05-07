import axios from 'axios';
import { useEffect, useState } from 'react';

const ChatPage = () => {

  const [chats, setChats] = useState([]);

  const fetchData = async () => {
    const { data } = await axios.get('/api/chat');
    setChats(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>ChatPage</div>
  )
}

export default ChatPage