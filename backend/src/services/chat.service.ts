import { db } from '../db';
import { chats, chatUsers, users } from '../db/schema';
import { eq, inArray, and, or } from 'drizzle-orm';
import ErrorHandler from '../utils/errorHandler';

interface CreateChatInput {
  userId: number;
  receiverId: number;
}

interface CreateGroupChatInput {
  name: string;
  userIds: number[];
  adminId: number;
}

interface UpdateGroupChatInput {
  chatId: number;
  name: string;
  adminId: number;
}

interface AddUserToGroupInput {
  chatId: number;
  userId: number;
  adminId: number;
}

interface RemoveUserFromGroupInput {
  chatId: number;
  userId: number;
  adminId: number;
}

/**
 * Create or access a one-on-one chat
 * @param input Chat creation input
 * @returns The chat data
 */
export const accessChat = async (input: CreateChatInput) => {
  const { userId, receiverId } = input;

  // Check if chat already exists
  const existingChats = await db.select()
    .from(chats)
    .innerJoin(chatUsers, eq(chats.id, chatUsers.chatId))
    .where(
      and(
        eq(chats.isGroupChat, false),
        eq(chatUsers.userId, userId)
      )
    );

  // Filter chats where the receiver is also a member
  const chatWithReceiver = existingChats.filter(async ({ chats: chat }) => {
    const chatMembers = await db.select()
      .from(chatUsers)
      .where(eq(chatUsers.chatId, chat.id));
    
    return chatMembers.some(member => member.userId === receiverId);
  });

  // If chat exists, return it
  if (chatWithReceiver.length > 0) {
    const chat = chatWithReceiver[0].chats;
    
    // Get chat users
    const chatMembers = await db.select()
      .from(users)
      .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
      .where(eq(chatUsers.chatId, chat.id));
    
    return {
      ...chat,
      users: chatMembers.map(({ users }) => ({
        id: users.id,
        name: users.name,
        email: users.email,
        picture: users.picture
      }))
    };
  }

  // Create new chat
  const [newChat] = await db.insert(chats)
    .values({
      chatName: 'One on One Chat',
      isGroupChat: false
    })
    .returning();

  // Add users to chat
  await db.insert(chatUsers)
    .values([
      { chatId: newChat.id, userId },
      { chatId: newChat.id, userId: receiverId }
    ]);

  // Get chat with users
  const chatWithUsers = await db.select()
    .from(chats)
    .where(eq(chats.id, newChat.id));

  const chatMembers = await db.select()
    .from(users)
    .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
    .where(eq(chatUsers.chatId, newChat.id));

  return {
    ...chatWithUsers[0],
    users: chatMembers.map(({ users }) => ({
      id: users.id,
      name: users.name,
      email: users.email,
      picture: users.picture
    }))
  };
};

/**
 * Get all chats for a user
 * @param userId User ID
 * @returns Array of chats
 */
export const getChats = async (userId: number) => {
  // Get all chats where the user is a member
  const userChats = await db.select()
    .from(chats)
    .innerJoin(chatUsers, eq(chats.id, chatUsers.chatId))
    .where(eq(chatUsers.userId, userId));

  // Get users for each chat
  const chatsWithUsers = await Promise.all(
    userChats.map(async ({ chats: chat }) => {
      const chatMembers = await db.select()
        .from(users)
        .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
        .where(eq(chatUsers.chatId, chat.id));

      // Get group admin if it's a group chat
      let groupAdmin = null;
      if (chat.isGroupChat && chat.groupAdminId) {
        const [admin] = await db.select()
          .from(users)
          .where(eq(users.id, chat.groupAdminId));
        
        if (admin) {
          groupAdmin = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            picture: admin.picture
          };
        }
      }

      return {
        ...chat,
        users: chatMembers.map(({ users }) => ({
          id: users.id,
          name: users.name,
          email: users.email,
          picture: users.picture
        })),
        groupAdmin
      };
    })
  );

  return chatsWithUsers;
};

/**
 * Create a group chat
 * @param input Group chat creation input
 * @returns The created group chat
 */
export const createGroupChat = async (input: CreateGroupChatInput) => {
  const { name, userIds, adminId } = input;

  if (!name || !userIds || userIds.length < 2) {
    throw new ErrorHandler('Please provide all required fields and at least 2 users', 400);
  }

  // Create group chat
  const [newChat] = await db.insert(chats)
    .values({
      chatName: name,
      isGroupChat: true,
      groupAdminId: adminId
    })
    .returning();

  // Add users to chat (including admin)
  const uniqueUserIds = [...new Set([...userIds, adminId])];
  
  await db.insert(chatUsers)
    .values(
      uniqueUserIds.map(userId => ({
        chatId: newChat.id,
        userId
      }))
    );

  // Get chat with users
  const [chat] = await db.select()
    .from(chats)
    .where(eq(chats.id, newChat.id));

  const chatMembers = await db.select()
    .from(users)
    .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
    .where(eq(chatUsers.chatId, newChat.id));

  // Get admin
  const [admin] = await db.select()
    .from(users)
    .where(eq(users.id, adminId));

  return {
    ...chat,
    users: chatMembers.map(({ users }) => ({
      id: users.id,
      name: users.name,
      email: users.email,
      picture: users.picture
    })),
    groupAdmin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture
    }
  };
};

/**
 * Rename a group chat
 * @param input Group chat update input
 * @returns The updated group chat
 */
export const renameGroupChat = async (input: UpdateGroupChatInput) => {
  const { chatId, name, adminId } = input;

  // Check if chat exists and is a group chat
  const [chat] = await db.select()
    .from(chats)
    .where(
      and(
        eq(chats.id, chatId),
        eq(chats.isGroupChat, true)
      )
    );

  if (!chat) {
    throw new ErrorHandler('Chat not found or not a group chat', 404);
  }

  // Check if user is admin
  if (chat.groupAdminId !== adminId) {
    throw new ErrorHandler('Only admin can rename the group', 403);
  }

  // Update chat name
  const [updatedChat] = await db.update(chats)
    .set({ chatName: name })
    .where(eq(chats.id, chatId))
    .returning();

  // Get chat with users
  const chatMembers = await db.select()
    .from(users)
    .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
    .where(eq(chatUsers.chatId, chatId));

  // Get admin
  const [admin] = await db.select()
    .from(users)
    .where(eq(users.id, adminId));

  return {
    ...updatedChat,
    users: chatMembers.map(({ users }) => ({
      id: users.id,
      name: users.name,
      email: users.email,
      picture: users.picture
    })),
    groupAdmin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture
    }
  };
};

/**
 * Add a user to a group chat
 * @param input Add user input
 * @returns The updated group chat
 */
export const addUserToGroup = async (input: AddUserToGroupInput) => {
  const { chatId, userId, adminId } = input;

  // Check if chat exists and is a group chat
  const [chat] = await db.select()
    .from(chats)
    .where(
      and(
        eq(chats.id, chatId),
        eq(chats.isGroupChat, true)
      )
    );

  if (!chat) {
    throw new ErrorHandler('Chat not found or not a group chat', 404);
  }

  // Check if user is admin
  if (chat.groupAdminId !== adminId) {
    throw new ErrorHandler('Only admin can add users to the group', 403);
  }

  // Check if user is already in the chat
  const existingMember = await db.select()
    .from(chatUsers)
    .where(
      and(
        eq(chatUsers.chatId, chatId),
        eq(chatUsers.userId, userId)
      )
    );

  if (existingMember.length > 0) {
    throw new ErrorHandler('User is already in the group', 400);
  }

  // Add user to chat
  await db.insert(chatUsers)
    .values({
      chatId,
      userId
    });

  // Get chat with users
  const chatMembers = await db.select()
    .from(users)
    .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
    .where(eq(chatUsers.chatId, chatId));

  // Get admin
  const [admin] = await db.select()
    .from(users)
    .where(eq(users.id, adminId));

  return {
    ...chat,
    users: chatMembers.map(({ users }) => ({
      id: users.id,
      name: users.name,
      email: users.email,
      picture: users.picture
    })),
    groupAdmin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture
    }
  };
};

/**
 * Remove a user from a group chat
 * @param input Remove user input
 * @returns The updated group chat
 */
export const removeUserFromGroup = async (input: RemoveUserFromGroupInput) => {
  const { chatId, userId, adminId } = input;

  // Check if chat exists and is a group chat
  const [chat] = await db.select()
    .from(chats)
    .where(
      and(
        eq(chats.id, chatId),
        eq(chats.isGroupChat, true)
      )
    );

  if (!chat) {
    throw new ErrorHandler('Chat not found or not a group chat', 404);
  }

  // Check if user is admin
  if (chat.groupAdminId !== adminId) {
    throw new ErrorHandler('Only admin can remove users from the group', 403);
  }

  // Check if user is in the chat
  const existingMember = await db.select()
    .from(chatUsers)
    .where(
      and(
        eq(chatUsers.chatId, chatId),
        eq(chatUsers.userId, userId)
      )
    );

  if (existingMember.length === 0) {
    throw new ErrorHandler('User is not in the group', 400);
  }

  // Remove user from chat
  await db.delete(chatUsers)
    .where(
      and(
        eq(chatUsers.chatId, chatId),
        eq(chatUsers.userId, userId)
      )
    );

  // Get chat with users
  const chatMembers = await db.select()
    .from(users)
    .innerJoin(chatUsers, eq(users.id, chatUsers.userId))
    .where(eq(chatUsers.chatId, chatId));

  // Get admin
  const [admin] = await db.select()
    .from(users)
    .where(eq(users.id, adminId));

  return {
    ...chat,
    users: chatMembers.map(({ users }) => ({
      id: users.id,
      name: users.name,
      email: users.email,
      picture: users.picture
    })),
    groupAdmin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture
    }
  };
}; 