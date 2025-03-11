import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { allMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management
 */

/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: Send a message in a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - chatId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the message
 *               chatId:
 *                 type: integer
 *                 description: ID of the chat to send the message to
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: User is not a member of the chat
 *       404:
 *         description: Chat not found
 */
router.route('/').post(auth, sendMessage);

/**
 * @swagger
 * /api/message/{chatId}:
 *   get:
 *     summary: Get all messages in a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the chat to get messages from
 *     responses:
 *       200:
 *         description: List of messages in the chat
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: User is not a member of the chat
 *       404:
 *         description: Chat not found
 */
router.route('/:chatId').get(auth, allMessages);

export default router;