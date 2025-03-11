import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useChatContext } from '../../context/ChatProvider';
import { useEffect, useState } from 'react';
import { IUser } from '../../Api/Models/User';
import UserBadgeItem from '../user/UserBadgeItem';
import { useDebounce } from '../../hooks/Debounce';
import axios from 'axios';
import UserListItem from '../user/UserListItem';

interface IUpdateGroupModalProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  fetchMessages: () => Promise<void>;
}

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }: IUpdateGroupModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState<string>();
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats, sortChats } = useChatContext();

  const toast = useToast();

  const searchQuery = useDebounce(search, 300);

  const handleSearch = async (query: string) => {
    setSearch(query);
  };

  const handleDelete = async (userToDelete: IUser) => {
    if (selectedChat?.groupAdmin?.email !== user?.email && userToDelete?.email !== user?.email) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/chat/groupremove`, {
        chatId: selectedChat?.id,
        userId: userToDelete.id
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (userToDelete.email === user?.email) {
        setSelectedChat(undefined);
      } else {
        setSelectedChat(data);
        const updatedChats = chats.map(c => c.id === data.id ? data : c);
        setChats(sortChats(updatedChats));
      }
      
      setFetchAgain(!fetchAgain);
      fetchMessages();
    }
    catch(err: any) {
      toast({
        title: 'Error occuerd!',
        description: err.response?.data?.message || err.message,
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/chat/rename`, {
        chatId: selectedChat?.id,
        chatName: groupChatName
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      setSelectedChat(data);
      const updatedChats = chats.map(c => c.id === data.id ? data : c);
      setChats(sortChats(updatedChats));
      setFetchAgain(!fetchAgain);
    }
    catch(err: any) {
      toast({
        title: 'Error occuerd!',
        description: err.response?.data?.message || err.message,
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setRenameLoading(false);
    }

    setGroupChatName('');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!search) return setSearchResult([]);
      try {
        setLoading(true);

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user?search=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setSearchResult(data);
      } catch (err) {
        toast({
          title: 'Error Occured',
          description: 'Failed to load the search results',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleAddUser = async (userToAdd: IUser) => {
    if (selectedChat?.users?.find(user => user.id === userToAdd.id)) {
      toast({
        title: 'User already in group',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    if (selectedChat?.groupAdmin?.id !== user?.id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/chat/groupadd`, {
        chatId: selectedChat?.id,
        userId: userToAdd.id,
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      setSelectedChat(data);
      const updatedChats = chats.map(c => c.id === data.id ? data : c);
      setChats(sortChats(updatedChats));
      setFetchAgain(!fetchAgain);
    }
    catch(err: any) {
      toast({
        title: 'Error occuerd!',
        description: err.response?.data?.message || err.message,
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton display={{ base: 'flex' }} onClick={onOpen} icon={<ViewIcon />} aria-label={'Update Group'} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} fontFamily={'Work sans'} display={'flex'} justifyContent={'center'}>
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w={'100%'}
              display={'flex'}
              flexWrap={'wrap'}
              pb={3}
            >
              {selectedChat?.users?.map(user => (
                <UserBadgeItem key={user.id} user={user} handleFunction={() => handleDelete(user)} />
              ))}
            </Box>
            <FormControl display={'flex'}>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={'solid'}
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            {selectedChat?.groupAdmin?.email === user?.email && <>
            <FormControl display={'flex'}>
              <Input
                placeholder='Add User to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {
              loading ? (
                <Spinner size='lg' />
              ) : (
                searchResult?.map(user => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )
            }
            </>}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => user && handleDelete(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
