import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useChatContext } from '../context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './common/ProfileModal';
import { IUser } from '../Api/Models/User';
import UpdateGroupChatModal from './common/UpdateGroupChatModal';
import { useCallback, useEffect, useState, useRef } from 'react';
import { IMessage } from '../Api/Models/Message';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { IChat } from '../Api/Models/Chat';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

// Define the Lottie component props type
interface LottieProps {
  options: {
    loop: boolean;
    autoplay: boolean;
    animationData: any;
    rendererSettings: {
      preserveAspectRatio: string;
    };
  };
  height?: number;
  width?: number;
  style?: React.CSSProperties;
}

const ENDPOINT = import.meta.env.VITE_BACKEND_URI;
// Initialize socket outside the component to maintain connection
const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(ENDPOINT);
let selectedChatCompare: IChat | undefined;

interface ISingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleChat = ({ fetchAgain, setFetchAgain }: ISingleChatProps) => {
  const { user, selectedChat, setSelectedChat, chats, setChats, sortChats } = useChatContext();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  // Add a debounce timer reference
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Setup user
    if (user) {
      console.log("Setting up socket with user:", user);
      socket.emit('setup', user);
    }
    
    // Setup event listeners
    socket.on('connected', () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop_typing', () => setIsTyping(false));

    // Cleanup function to remove listeners when component unmounts
    return () => {
      socket.off('connected');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, [user]);

  useEffect(() => {
    // Update the selectedChatCompare reference when selectedChat changes
    selectedChatCompare = selectedChat;
    
    const messageReceivedHandler = (newMessageReceived: IMessage) => {
      console.log('Message received from socket:', newMessageReceived);
      
      // If no chat is selected or the message is for a different chat, don't update
      if (!selectedChatCompare || selectedChatCompare.id !== newMessageReceived.chat.id) {
        // Give Notification (future enhancement)
        console.log("Message is for a different chat");
      } else {
        console.log('Adding message to state for current chat');
        setMessages(prevMessages => [...prevMessages, newMessageReceived]);
        
        // Update the chat list to show this chat at the top with latest message
        if (selectedChat) {
          const updatedChat = { ...selectedChat, latestMessage: newMessageReceived };
          
          // Update the chats list with the updated chat and sort
          const updatedChats = chats.map(c => 
            c.id === selectedChat.id ? updatedChat : c
          );
          setChats(sortChats(updatedChats));
        }
      }
    };

    // Remove any existing listeners to prevent duplicates
    socket.off('message_recieved');
    // Add the message received listener
    socket.on('message_recieved', messageReceivedHandler);

    // Cleanup function to remove listener when component unmounts or dependencies change
    return () => {
      socket.off('message_recieved');
    };
  }, [selectedChat, chats, setChats, sortChats]);

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/message/${selectedChat?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-type': 'application/json',
        },
      });

      // Sort messages by creation date (oldest first)
      const sortedMessages = [...data].sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      setMessages(sortedMessages);

      // Join the chat room
      console.log(`Joining chat room: ${selectedChat.id}`);
      socket.emit('join_chat', selectedChat.id.toString());
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedChat, toast, user?.token]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [fetchMessages, selectedChat]);

  const sendMessage = async (e: any) => {
    if (e.key !== 'Enter' || !newMessage) return;

    socket.emit('stop_typing', selectedChat?.id.toString());
    try {
      // Store message content before clearing input
      const messageContent = newMessage;
      setNewMessage('');

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/message`,
        {
          content: messageContent,
          chatId: selectedChat?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-type': 'application/json',
          },
        }
      );

      console.log('Sending message to socket:', data);
      socket.emit('new_message', data);
      
      // Add the new message to the end (it will be the newest)
      setMessages(prevMessages => [...prevMessages, data]);
      
      // Update the selected chat with the latest message
      if (selectedChat) {
        const updatedChat = { ...selectedChat, latestMessage: data };
        setSelectedChat(updatedChat);
        
        // Update the chats list with the updated chat and sort
        const updatedChats = chats.map(c => 
          c.id === selectedChat.id ? updatedChat : c
        );
        setChats(sortChats(updatedChats));
      }
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to send the message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    // If not already typing, emit typing event
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat?.id.toString());
    }

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a longer debounce time (5 seconds)
    const timerLength = 5000;
    
    // Create new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', selectedChat?.id.toString());
      setTyping(false);
      typingTimeoutRef.current = null;
    }, timerLength);
  };

  useEffect(() => {
    // Cleanup typing timeout when component unmounts or selectedChat changes
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={{ base: 'space-between' }}
            alignContent={'center'}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(undefined)}
              aria-label={'Back Btn'}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users) as IUser} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius={'lg'}
            overflowY={'hidden'}
          >
            {loading ? (
              <Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'} />
            ) : (
              <Box display={'flex'} flexDir={'column'} overflowY={'scroll'}>
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div style={{ 
                  marginBottom: 15, 
                  marginLeft: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    backgroundColor: '#E8E8E8',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    maxWidth: '75%',
                    marginLeft: 0
                  }}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData,
                        rendererSettings: {
                          preserveAspectRatio: 'xMidYMid slice',
                        },
                      }}
                      width={70}
                      height={30}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={'filled'}
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} h="100%">
          <Text fontSize="3xl" pb={3} fontFamily={'Work sans'}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

