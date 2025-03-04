import express from "express";
import { createChat, getChats, deleteChat } from "../controllers/chatController.js";
import {verifyToken} from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createChat);
router.get("/", verifyToken, getChats);
router.delete("/:chatId", verifyToken, deleteChat);

export default router;
