import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IUser } from '../../Api/Models/User';
import { useChatContext } from '../../context/ChatProvider';
import axios from 'axios';
import { useDebounce } from '../../hooks/Debounce';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../user/UserBadgeItem';

interface IGroupChatModalProps {
  children: any;
}

const GroupChatModal = ({ children }: IGroupChatModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const toast = useToast();

  const { user, chats, setChats } = useChatContext();

  const searchQuery = useDebounce(search, 300);

  const handleSearch = async (query: string) => {
    setSearch(query);
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please full all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/chat/group`, { 
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(user => user._id))
      },{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setChats(chats => [data, ...chats]);
      onClose();
      toast({
        title: 'New Group Chat created',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
    catch (err: any) {      
      toast({
        title: 'Error while creating the group chat',
        description: err.response.data.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleGroup = (user: IUser) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setSelectedUsers((selectedUsers) => [...selectedUsers, user]);
  };

  const handleDelete = (userToDel: IUser) => {
    setSelectedUsers(selectedUsers => selectedUsers.filter(user => user._id !== userToDel._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily={'Work sans'} display={'flex'} justifyContent={'center'}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
            <FormControl>
              <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Jack, Jill"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
              {selectedUsers.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                ?.map((user) => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
