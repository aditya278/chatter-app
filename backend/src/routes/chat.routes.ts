import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chat.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat management
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Create or access a one-on-one chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user to chat with
 *     responses:
 *       200:
 *         description: Chat accessed or created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *
 *   get:
 *     summary: Get all chats for the current user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 *       401:
 *         description: Not authorized
 */
router.route('/').post(auth, accessChat).get(auth, fetchChats);

/**
 * @swagger
 * /api/chat/group:
 *   post:
 *     summary: Create a group chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - users
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the group chat
 *               users:
 *                 type: array
 *                 description: Array of user IDs to add to the group
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Group chat created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.route('/group').post(auth, createGroupChat);

/**
 * @swagger
 * /api/chat/rename:
 *   put:
 *     summary: Rename a group chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - chatName
 *             properties:
 *               chatId:
 *                 type: integer
 *                 description: ID of the chat to rename
 *               chatName:
 *                 type: string
 *                 description: New name for the chat
 *     responses:
 *       200:
 *         description: Chat renamed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not admin of the group
 *       404:
 *         description: Chat not found
 */
router.route('/rename').put(auth, renameGroup);

/**
 * @swagger
 * /api/chat/groupremove:
 *   put:
 *     summary: Remove a user from a group chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - userId
 *             properties:
 *               chatId:
 *                 type: integer
 *                 description: ID of the chat
 *               userId:
 *                 type: integer
 *                 description: ID of the user to remove
 *     responses:
 *       200:
 *         description: User removed from group successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not admin of the group
 *       404:
 *         description: Chat not found
 */
router.route('/groupremove').put(auth, removeFromGroup);

/**
 * @swagger
 * /api/chat/groupadd:
 *   put:
 *     summary: Add a user to a group chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - userId
 *             properties:
 *               chatId:
 *                 type: integer
 *                 description: ID of the chat
 *               userId:
 *                 type: integer
 *                 description: ID of the user to add
 *     responses:
 *       200:
 *         description: User added to group successfully
 *       400:
 *         description: Invalid input or user already in group
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not admin of the group
 *       404:
 *         description: Chat not found
 */
router.route('/groupadd').put(auth, addToGroup);

export default router;