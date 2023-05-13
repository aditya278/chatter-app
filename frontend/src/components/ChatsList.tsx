import { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatProvider"
import { IUser } from "../Api/Models/User";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./common/ChatLoading";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./common/GroupChatModal";

const ChatsList = ({ fetchAgain } : { fetchAgain: boolean }) => {
  const [loggedUser, setLoggedUser] = useState<IUser>();
  const { chats, setChats, selectedChat, setSelectedChat, user } = useChatContext();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      };

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/chat`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-type': 'application/json'
        }
      });
      setChats(data);
    }
    catch(err) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load the chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo') || ''));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(chat.users, loggedUser) as string
                    : chat.chatName}
                </Text>
                {chat.latestMessage?.length ? (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage?.[0].sender?.name} : </b>
                    {(chat.latestMessage?.[0].content?.length || 0) > 50
                      ? chat.latestMessage?.[0].content?.substring(0, 51) + "..."
                      : chat.latestMessage?.[0].content}
                  </Text>
                ) : null}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default ChatsList