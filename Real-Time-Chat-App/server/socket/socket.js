import { Server } from "socket.io";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const users = new Map(); // Track online users (userId -> socketId)

const initializeSocket = (server) => {
    console.log("Initializing socket.io");
    const io = new Server(server, {
        cors: { 
            origin: "*", 
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log('any thing');
        console.log("New user connected:", socket.id);

        // 1️⃣ User Online/Offline Tracking**
        socket.on("user-online", async (userId) => {
            users.set(userId, socket.id);
            await User.findByIdAndUpdate(userId, { status: "online" });
            io.emit("update-user-status", { userId, status: "online" });
        });

        socket.on("user-offline", async (userId) => {
            users.delete(userId);
            await User.findByIdAndUpdate(userId, { status: "offline" });
            io.emit("update-user-status", { userId, status: "offline" });
        });

        // 2️⃣ Sending Messages with Attachments**
        socket.on("send-message", async ({ sender, chatId, text, attachments = [] }) => {
            try {
                const newMessage = await Message.create({ sender, chat: chatId, text, attachments });
                await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } });

                const messageData = await newMessage.populate("sender", "username profilePic");
                
                io.to(chatId).emit("new-message", messageData);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        // 3️⃣ Mark Messages as Read (SeenBy)**
        socket.on("mark-as-read", async ({ userId, chatId }) => {
            try {
                await Message.updateMany(
                    { chat: chatId, seenBy: { $ne: userId } },
                    { $push: { seenBy: userId } }
                );

                io.to(chatId).emit("update-seen", { chatId, userId });
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        });

        // 4️⃣ Real-time Group and Chat Updates**
        socket.on("join-chat", (chatId) => {
            socket.join(chatId);
        });

        socket.on("leave-chat", (chatId) => {
            socket.leave(chatId);
        });

        socket.on("create-chat", async ({ chatId }) => {
            io.emit("new-chat", chatId);
        });

        socket.on("create-group", async ({ groupId }) => {
            io.emit("new-group", groupId);
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);
            for (let [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    await User.findByIdAndUpdate(userId, { status: "offline" });
                    io.emit("update-user-status", { userId, status: "offline" });
                    break;
                }
            }
        });
    });
};

export default initializeSocket;
