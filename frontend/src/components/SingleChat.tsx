import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useChatContext } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import ProfileModal from './common/ProfileModal';
import { IUser } from '../Api/Models/User';
import UpdateGroupChatModal from './common/UpdateGroupChatModal';

interface ISingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleChat = ({ fetchAgain, setFetchAgain }: ISingleChatProps) => {
  const { user, selectedChat, setSelectedChat } = useChatContext();

  return (
    <>
      {selectedChat ? (
        <>
        <Text
          fontSize={{ base: '28px', md: '30px'}}
          pb={3}
          px={2}
          w='100%'
          fontFamily={'Work sans'}
          display={'flex'}
          justifyContent={{ base: 'space-between'}}
          alignContent={'center'}
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat(undefined)} aria-label={'Back Btn'}
          />
          {
            !selectedChat.isGroupChat ? (
              <>
                {getSender(selectedChat.users, user)}
                <ProfileModal user={getSender(selectedChat.users, user, true) as IUser} />
              </>
            ) : (
              <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </>
            )
          }
        </Text>
        <Box
          display={'flex'}
          flexDir={'column'}
          justifyContent={'flex-end'}
          p={3}
          bg='#E8E8E8'
          w='100%'
          h='100%'
          borderRadius={'lg'}
          overflowY={'hidden'}
        >
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
