
import express from "express";
import { sendMessage, getMessages, deleteMessage, markAsRead } from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API for managing messages
 */

/**
 * @swagger
 * /messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message deleted
 *       500:
 *         description: Error deleting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting message
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /messages/mark-as-read:
 *   post:
 *     summary: Mark messages as read
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat
 *                 example: 60d21b4667d0d8992e610c85
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Messages marked as read
 *       500:
 *         description: Error marking messages as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error marking messages as read
 *                 error:
 *                   type: string
 */
router.delete("/:messageId", verifyToken, deleteMessage);


router.post("/mark-as-read", verifyToken, markAsRead);

export default router;
