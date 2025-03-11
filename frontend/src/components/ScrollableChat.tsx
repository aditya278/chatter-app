import { IMessage } from "../Api/Models/Message";
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { useChatContext } from "../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages}: { messages: IMessage[]}) => {
  const { user } = useChatContext();

  return (
    <ScrollableFeed>
      {
        messages && messages.map((message: IMessage, idx: number) => (
          <div style={{ display: 'flex'}} key={message.id}>
            {(isSameSender(messages, message, idx, user?.email as string)
            || isLastMessage(messages, idx, user?.email as string)
            ) && (
              <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                <Avatar 
                  mt='7px'
                  mr={1}
                  size='sm'
                  cursor={'pointer'}
                  name={message.sender.name}
                  src={message.sender.picture}
                />
              </Tooltip>
            )}
            <span style={{
              backgroundColor: `${message.sender.email === user?.email ? '#BEE3F8' : "#B9F5D0"}`,
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              marginLeft: isSameSenderMargin(messages, message, idx, user?.email as string),
              marginTop: isSameUser(messages, message, idx) ? 3 : 10
            }}>
              {message.content}
            </span>
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat