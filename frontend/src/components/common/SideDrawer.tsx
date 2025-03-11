import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useToast } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { useDisclosure } from '@chakra-ui/hooks';
import { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useChatContext } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { IUser } from '../../Api/Models/User';
import UserListItem from '../user/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResut] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const history = useHistory();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setSelectedChat, chats, setChats, sortChats } = useChatContext();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      setSearchResut(data);
    } catch (err) {
      console.log('Err: ', err);
      toast({
        title: 'Error Occured!',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (id: number) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/chat`, { userId: id }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-type': 'application/json'
        }
      });

      if (!chats.find((c) => c.id === data.id)) {
        setChats(sortChats([data, ...chats]));
      }

      setSelectedChat(data);
      onClose();

    } catch (err: any) {
      toast({
        title: 'Error fetching the chat',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setLoadingChat(false);
    }
  }

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg="white"
        w='100%'
        p='5px 10px 5px 10p x'
        borderWidth={'5px'}
      >
        <Tooltip label='Search Users to Chat' hasArrow placement='bottom'>
          <Button variant={'ghost'} onClick={onOpen}>
            <i className='fas fa-search'></i>
            <Text display={{ base: 'none', md: 'flex' }} px='4'>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily={'Work sans'}>Chatter</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={'2xl'} m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user?.name} src={user?.picture} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement='left'
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user: IUser) => <UserListItem key={user.id} user={user} handleFunction={accessChat} />)
              )
            }
            {loadingChat && <Spinner ml={'auto'} display={'flex'} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer;