import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user.schema';
import { relations } from 'drizzle-orm';

// Define the chats table schema
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  chatName: text('chat_name').notNull(),
  isGroupChat: boolean('is_group_chat').default(false),
  groupAdminId: integer('group_admin_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Define the chat_users junction table for many-to-many relationship
export const chatUsers = pgTable('chat_users', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').notNull().references(() => chats.id),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Define the messages table schema
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  chatId: integer('chat_id').notNull().references(() => chats.id),
  senderId: integer('sender_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Define relations
export const chatsRelations = relations(chats, ({ one, many }) => ({
  users: many(chatUsers),
  groupAdmin: one(users, {
    fields: [chats.groupAdminId],
    references: [users.id]
  }),
  messages: many(messages)
}));

export const chatUsersRelations = relations(chatUsers, ({ one }) => ({
  chat: one(chats, {
    fields: [chatUsers.chatId],
    references: [chats.id]
  }),
  user: one(users, {
    fields: [chatUsers.userId],
    references: [users.id]
  })
}));

// Define message relations
export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id]
  })
}));

// Define types for TypeScript
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type ChatUser = typeof chatUsers.$inferSelect;
export type NewChatUser = typeof chatUsers.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

// Create Zod schemas for validation
export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);
export const insertChatUserSchema = createInsertSchema(chatUsers);
export const selectChatUserSchema = createSelectSchema(chatUsers);
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages); 