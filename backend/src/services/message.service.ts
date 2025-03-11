import { db } from '../db';
import { messages, chats, chatUsers, users } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import ErrorHandler from '../utils/errorHandler';

interface SendMessageInput {
  content: string;
  chatId: number;
  senderId: number;
}

/**
 * Send a message in a chat
 * @param input Message data
 * @returns The sent message with sender and chat information
 */
export const sendMessage = async (input: SendMessageInput) => {
  const { content, chatId, senderId } = input;

  if (!content || !chatId) {
    throw new ErrorHandler('Please provide message content and chat ID', 400);
  }

  // Check if chat exists
  const [chat] = await db.select()
    .from(chats)
    .where(eq(chats.id, chatId));

  if (!chat) {
    throw new ErrorHandler('Chat not found', 404);
  }

  // Check if user is a member of the chat
  const chatMember = await db.select()
    .from(chatUsers)
    .where(
      and(
        eq(chatUsers.chatId, chatId),
        eq(chatUsers.userId, senderId)
      )
    );

  if (chatMember.length === 0) {
    throw new ErrorHandler('User is not a member of this chat', 403);
  }

  // Create message
  const [newMessage] = await db.insert(messages)
    .values({
      content,
      chatId,
      senderId
    })
    .returning();

  // Get sender information
  const [sender] = await db.select()
    .from(users)
    .where(eq(users.id, senderId));

  // Get chat with users
  const chatMembers = await db.select()
    .from(users)
    .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
    .where(eq(chatUsers.chatId, chatId));

  return {
    ...newMessage,
    sender: {
      id: sender.id,
      name: sender.name,
      email: sender.email,
      picture: sender.picture
    },
    chat: {
      ...chat,
      users: chatMembers.map(({ users }) => ({
        id: users.id,
        name: users.name,
        email: users.email,
        picture: users.picture
      }))
    }
  };
};

/**
 * Get all messages for a chat
 * @param chatId Chat ID
 * @param userId User ID (to verify membership)
 * @returns Array of messages with sender information
 */
export const getMessages = async (chatId: number, userId: number) => {
  // Check if chat exists
  const [chat] = await db.select()
    .from(chats)
    .where(eq(chats.id, chatId));

  if (!chat) {
    throw new ErrorHandler('Chat not found', 404);
  }

  // Check if user is a member of the chat
  const chatMember = await db.select()
    .from(chatUsers)
    .where(
      and(
        eq(chatUsers.chatId, chatId),
        eq(chatUsers.userId, userId)
      )
    );

  if (chatMember.length === 0) {
    throw new ErrorHandler('User is not a member of this chat', 403);
  }

  // Get messages with sender information
  const chatMessages = await db.select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(desc(messages.createdAt));

  // Get sender information for each message
  const messagesWithSender = await Promise.all(
    chatMessages.map(async (message) => {
      const [sender] = await db.select()
        .from(users)
        .where(eq(users.id, message.senderId));

      return {
        ...message,
        sender: {
          id: sender.id,
          name: sender.name,
          email: sender.email,
          picture: sender.picture
        }
      };
    })
  );

  return messagesWithSender;
}; 