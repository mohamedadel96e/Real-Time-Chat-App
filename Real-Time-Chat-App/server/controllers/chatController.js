import Chat from "../models/Chat.js";

// Create a Chat
export const createChat = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const chat = await Chat.create({ name, description, members, admins: [req.user.id] });
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error creating chat", error });
    }
};

// Get All Chats for a User
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members: req.user.id });
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
