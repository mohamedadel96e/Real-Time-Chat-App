import express from "express";
import { createChat, getChats, deleteChat } from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the chat
 *         name:
 *           type: string
 *           description: The name of the chat
 *         description:
 *           type: string
 *           description: The description of the chat
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs of the chat members
 *         admins:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs of the chat admins
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Chat creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Chat update timestamp
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the message
 *         sender:
 *           type: string
 *           description: User ID of the sender
 *         chat:
 *           type: string
 *           description: Chat ID the message belongs to
 *         text:
 *           type: string
 *           description: Message content
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: Attachments of the message
 *         seenBy:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs who have seen the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Message creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Message update timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: The chat managing API
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the chat
 *               description:
 *                 type: string
 *                 description: The description of the chat
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The user IDs of the chat members
 *             example:
 *               name: "General"
 *               description: "General chat for all users"
 *               members: ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"]
 *     responses:
 *       201:
 *         description: The chat was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Get all chats for the authenticated user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /chats/{chatId}:
 *   delete:
 *     summary: Delete a chat by id
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The chat id
 *     responses:
 *       200:
 *         description: The chat was deleted
 *       500:
 *         description: Some server error
 */





router.post("/", verifyToken, createChat);



router.get("/", verifyToken, getChats); 


router.delete("/:chatId", verifyToken, deleteChat);

export default router;
