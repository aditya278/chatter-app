/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - password
 *         - picture
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *         picture:
 *           type: string
 *           description: The URL of the user's profile picture
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *         password: $2a$10$XYZ...
 *         picture: http://example.com/avatar.jpg
 *         createdAt: 2023-03-11T12:00:00Z
 *         updatedAt: 2023-03-11T12:00:00Z
 *
 *     UserResponse:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - picture
 *         - token
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         picture:
 *           type: string
 *           description: The URL of the user's profile picture
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *         picture: http://example.com/avatar.jpg
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     Chat:
 *       type: object
 *       required:
 *         - id
 *         - chatName
 *         - isGroupChat
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the chat
 *         chatName:
 *           type: string
 *           description: The name of the chat
 *         isGroupChat:
 *           type: boolean
 *           description: Whether the chat is a group chat
 *         groupAdminId:
 *           type: integer
 *           nullable: true
 *           description: The id of the group admin (if it's a group chat)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the chat was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the chat was last updated
 *       example:
 *         id: 1
 *         chatName: Group Chat
 *         isGroupChat: true
 *         groupAdminId: 1
 *         createdAt: 2023-03-11T12:00:00Z
 *         updatedAt: 2023-03-11T12:00:00Z
 *
 *     ChatResponse:
 *       type: object
 *       required:
 *         - id
 *         - chatName
 *         - isGroupChat
 *         - users
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the chat
 *         chatName:
 *           type: string
 *           description: The name of the chat
 *         isGroupChat:
 *           type: boolean
 *           description: Whether the chat is a group chat
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 *           description: The users in the chat
 *         groupAdmin:
 *           $ref: '#/components/schemas/UserResponse'
 *           nullable: true
 *           description: The group admin (if it's a group chat)
 *       example:
 *         id: 1
 *         chatName: Group Chat
 *         isGroupChat: true
 *         users: [
 *           {
 *             id: 1,
 *             name: John Doe,
 *             email: john@example.com,
 *             picture: http://example.com/avatar.jpg
 *           },
 *           {
 *             id: 2,
 *             name: Jane Doe,
 *             email: jane@example.com,
 *             picture: http://example.com/avatar2.jpg
 *           }
 *         ]
 *         groupAdmin: {
 *           id: 1,
 *           name: John Doe,
 *           email: john@example.com,
 *           picture: http://example.com/avatar.jpg
 *         }
 *
 *     Message:
 *       type: object
 *       required:
 *         - id
 *         - content
 *         - chatId
 *         - senderId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the message
 *         content:
 *           type: string
 *           description: The content of the message
 *         chatId:
 *           type: integer
 *           description: The id of the chat the message belongs to
 *         senderId:
 *           type: integer
 *           description: The id of the user who sent the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was last updated
 *       example:
 *         id: 1
 *         content: Hello, world!
 *         chatId: 1
 *         senderId: 1
 *         createdAt: 2023-03-11T12:00:00Z
 *         updatedAt: 2023-03-11T12:00:00Z
 *
 *     MessageResponse:
 *       type: object
 *       required:
 *         - id
 *         - content
 *         - chatId
 *         - sender
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the message
 *         content:
 *           type: string
 *           description: The content of the message
 *         chatId:
 *           type: integer
 *           description: The id of the chat the message belongs to
 *         sender:
 *           $ref: '#/components/schemas/UserResponse'
 *           description: The user who sent the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was last updated
 *       example:
 *         id: 1
 *         content: Hello, world!
 *         chatId: 1
 *         sender: {
 *           id: 1,
 *           name: John Doe,
 *           email: john@example.com,
 *           picture: http://example.com/avatar.jpg
 *         }
 *         createdAt: 2023-03-11T12:00:00Z
 *         updatedAt: 2023-03-11T12:00:00Z
 */

// This file is only for Swagger documentation
export {}; 