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

interface ISingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleChat = ({ fetchAgain, setFetchAgain }: ISingleChatProps) => {
  const { user, selectedChat, setSelectedChat } = useChatContext();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/message/${selectedChat?._id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-type': 'application/json'
        }
      });
      
      setMessages(data);

    } catch (err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to send the message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat?._id]);

  const sendMessage = async (e: any) => { 
    if(e.key !== 'Enter' || !newMessage) return;

    try {
      setNewMessage('');

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/message`, {
        content: newMessage,
        chatId: selectedChat?._id
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-type': 'application/json'
        }
      });

      setMessages(messages => [...messages, data]);
      // setFetchAgain(!fetchAgain);
    } catch(err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to send the message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const typingHandler = (e: any) => { 
    setNewMessage(e.target.value);
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
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
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
              <Box
                display={'flex'}
                flexDir={'column'}
                overflowY={'scroll'}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
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
