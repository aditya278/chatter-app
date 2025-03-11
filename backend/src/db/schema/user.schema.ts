import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Define the users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  picture: text('picture').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Define types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Create a schema for user registration with password confirmation
export const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data: { password: string, confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Create a schema for user authentication
export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Create a schema for user data (without password)
export const userDataSchema = selectUserSchema.omit({ password: true });

// Type for user data (without password)
export type UserData = z.infer<typeof userDataSchema>; 