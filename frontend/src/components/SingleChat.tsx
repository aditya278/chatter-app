import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useChatContext } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import ProfileModal from './common/ProfileModal';
import { IUser } from '../Api/Models/User';
import UpdateGroupChatModal from './common/UpdateGroupChatModal';
import { useEffect, useState } from 'react';
import { IMessage } from '../Api/Models/Message';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { IChat } from '../Api/Models/Chat';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const ENDPOINT = 'http://127.0.0.1:5050';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let selectedChatCompare: IChat | undefined;

interface ISingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleChat = ({ fetchAgain, setFetchAgain }: ISingleChatProps) => {
  const { user, selectedChat, setSelectedChat } = useChatContext();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop_typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on('message_recieved', (newMessageReceived: IMessage) => {
      console.log('Got new Message: ', newMessage);
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Give Notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/message/${selectedChat?._id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-type': 'application/json',
        },
      });

      setMessages(data);

      socket.emit('join_chat', selectedChat._id);
    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to send the message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat?._id]);

  const sendMessage = async (e: any) => {
    if (e.key !== 'Enter' || !newMessage) return;

    socket.emit('stop_typing', selectedChat?._id);
    try {
      setNewMessage('');

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/message`,
        {
          content: newMessage,
          chatId: selectedChat?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-type': 'application/json',
          },
        }
      );

      socket.emit('new_message', data);
      setMessages((messages) => [...messages, data]);
      // setFetchAgain(!fetchAgain);
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

  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat?._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLen = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLen && typing) {
        socket.emit('stop_typing', selectedChat?._id);
        setTyping(false);
      }
    }, timerLen);
  };

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
                {getSender(selectedChat.users, user)}
                <ProfileModal user={getSender(selectedChat.users, user, true) as IUser} />
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
                <Lottie
                  width={70}
                  height={-1}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice',
                    },
                  }}
                />
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
