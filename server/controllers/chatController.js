import Chat from "../models/Chat.js";
import User from "../models/User.js";
// Create a Chat
export const createChat = async (req, res) => {
  try {
      const { name, email } = req.body;
      const secondMember = await User.findOne({ email });
      
      if (!secondMember) {
          return res.status(404).json({ message: "User not found" });
      }

      const members = [req.user.id, secondMember._id];

      // Check if a chat already exists between these two users
      const existingChat = await Chat.findOne({
          members: { $all: members, $size: 2 },
          admins: { $in: [req.user.id, secondMember._id] }
      });

      if (existingChat) {
          return res.status(200).json(existingChat); // Return existing chat if found
      }

      // Create new chat if no existing chat is found
      const chat = await Chat.create({ name, members, admins: [req.user.id] });
      res.status(201).json(chat);
  } catch (error) {
      res.status(500).json({ message: "Error creating chat", error });  
  }
};

// Get All Chats for a User
export const getChats = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const userId = req.user.id;
    const chats = await Chat.find({ members: userId })
      .populate({
        path: "members",
        select: "name profilePic",
      })
      .populate({
        path: "messages",
        select: "text sender createdAt",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "sender",
          select: "name profilePic",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// Delete a Chat
export const deleteChat = async (req, res) => {
    try {
        await Chat.findByIdAndDelete(req.params.chatId);
        res.status(200).json({ message: "Chat deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chat", error });
    }
};
