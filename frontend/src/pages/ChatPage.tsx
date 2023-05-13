import { useState } from 'react';
import { useChatContext } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/common/SideDrawer';
import ChatsList from '../components/ChatsList';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {

  const [fetchAgain, setFetchAgain] = useState(false);

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
        { user && <ChatsList fetchAgain={fetchAgain} /> }
        { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
      </Box>
    </div>
  )
}

export default ChatPage