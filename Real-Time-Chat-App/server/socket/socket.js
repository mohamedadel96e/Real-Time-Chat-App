import { Server } from "socket.io";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const users = new Map(); // Track online users (userId -> socketId)

const initializeSocket = (server) => {  
    console.log("Initializing socket.io");
    console.log(users);
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);
        io.emit("connection", {"Hello": "World"});
        // 1️⃣ User Online/Offline Tracking
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

        // 2️⃣ Sending Messages with Attachments
        socket.on("send-message", async ({ sender, chatId, text, attachments = [] }) => {
            try {
                console.log("New message:", { sender, chatId, text, attachments });
                const newMessage = await Message.create({ sender, chat: chatId, text, attachments });
                await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } });
                const messageData = await newMessage.populate("sender", "username profilePic");
                io.to(chatId).emit("new-message", messageData);
                console.log("New message:", messageData);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        // 3️⃣ Mark Messages as Read (SeenBy)
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

        // 4️⃣ Typing Indicators
        // When a user is typing, broadcast to others in the room.
        socket.on("typing",async ({ chatId, userId }) => {
            // Emit to everyone in the room except the sender
            socket.to(chatId).emit("typing", { userId });
        });

        // When the user stops typing, broadcast the stop event.
        socket.on("stop-typing",async ({ chatId, userId }) => {
            socket.to(chatId).emit("stop-typing", { userId });
        });

        // 5️⃣ Real-time Group and Chat Updates
        socket.on("join-chat", async ({ chatId }) => {
            try {
                console.log("User joined chat:", chatId);
        
                // Convert chatId to a valid ObjectId
                chatId = new mongoose.Types.ObjectId(chatId);
                const chatRoom = chatId.toString();
        
                // Join the chat room
                socket.join(chatRoom);
                console.log(`Socket ${socket.id} joined room ${chatRoom}`);
        
                // Notify only users in the chat room
                io.to(chatRoom).emit("joined-chat", { chatId: chatRoom });
        
            } catch (error) {
                console.error("Error joining chat:", error);
            }
        });
        

        // 6️⃣ Handle Disconnect
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
