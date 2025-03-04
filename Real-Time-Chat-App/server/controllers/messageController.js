import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
    try {
        const { chatId, text, attachments = [] } = req.body;
        const sender = req.user.id;
        
        const newMessage = await Message.create({ sender, chat: chatId, text, attachments });

        await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } });
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
  try {
      const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "username profilePic");
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