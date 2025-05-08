import express from "express";
import multer from "multer";
import upload from "../config/upload.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const sendMessage = (req, res) => {
  upload.array("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Fail Size Is More Than 1MB " });
      }
      return res.status(400).json({ error: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: `Message: ${err.message}` });
    }

    try {
      const { chatId, text } = req.body;
      const senderId = req.user.id; 
      if (!chatId) {
        return res.status(400).json({ error: "Input Chat_id" });
      }

      const fileUrls = req.files ? req.files.map((file) => file.path) : [];

      const newMessage = new Message({
        chat: chatId,
        sender: senderId,
        text: text || "", 
        attachments: fileUrls, 
      });

      await newMessage.save();
      await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } });

      res.json({ message: "File uploaded and message sent successfully!" });
    } catch (error) {
      res.status(500).json({Message: "Error in Sending Message", details: error.message });
    }
  });
};

export const getMessages = async (req, res) => {
  try {
      const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name profilePic");
      res.status(200).json(messages);
  } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const deleteMessage = async (req, res) => {
  try {
      await Message.findByIdAndDelete(req.params.messageId);
      res.status(200).json({ message: "Message deleted" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting message", error });
  }
};

export const markAsRead = async (req, res) => {
  try {
      await Message.updateMany(
          { chat: req.body.chatId, seenBy: { $ne: req.user.id } },
          { $push: { seenBy: req.user.id } }
      );
      res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
      res.status(500).json({ message: "Error marking messages as read", error });
  }
};