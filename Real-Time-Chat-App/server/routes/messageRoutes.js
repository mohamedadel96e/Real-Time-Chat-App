import express from "express";
import { sendMessage, getMessages, deleteMessage, markAsRead } from "../controllers/messageController.js";
import {verifyToken} from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, getMessages);
router.delete("/:messageId", verifyToken, deleteMessage);
router.post("/mark-as-read", verifyToken, markAsRead);

export default router;
