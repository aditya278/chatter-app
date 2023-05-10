import axios from 'axios';
import { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/common/SideDrawer';
import ChatsList from '../components/ChatsList';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {

  const { user } = useChatContext();

  return (
    <div style={{ width: '100%'}}>
      { user && <SideDrawer />}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        w='100%'
        h='91.5vh'
        p='10px'
      >
        { user && <ChatsList /> }
        { user && <ChatBox /> }
      </Box>
    </div>
  )
}

export default ChatPage