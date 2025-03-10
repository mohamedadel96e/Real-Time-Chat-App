import { Server } from "socket.io";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const users = new Map(); // Track online users (userId -> socketId)

const notifications = new Map(); // Track unread messages (userId -> count)

/**
 * @swagger
 * ws://localhost:5010:
 *   get:
 *     summary: WebSocket Connection
 *     description: Establishes a WebSocket connection for real-time messaging.
 *     responses:
 *       101:
 *         description: WebSocket connection established
 */


const initializeSocket = (server) => {
  console.log("Initializing socket.io");
  console.log(users);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);
    io.emit("connection", { Hello: "World" });
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
    socket.on(
      "send-message",
      async ({ sender, chatId, text, attachments = [] }) => {
        try {
          console.log("New message:", { sender, chatId, text, attachments });
          const newMessage = await Message.create({
            sender,
            chat: chatId,
            text,
            attachments,
          });
          await Chat.findByIdAndUpdate(chatId, {
            $push: { messages: newMessage._id },
          });
          const messageData = await newMessage.populate(
            "sender",
            "username profilePic"
          );
          io.to(chatId).emit("new-message", messageData);
          console.log("New message:", messageData);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    // 3️⃣ Mark Messages as Read (SeenBy)
    socket.on("mark-as-read", async ({ userId, chatId }) => {
      try {
        // When a user join a chat, mark all messages as read
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
    socket.on("typing", async ({ chatId, userId }) => {
      // Emit to everyone in the room except the sender
      socket.to(chatId).emit("typing", { userId });
    });

    // When the user stops typing, broadcast the stop event.
    socket.on("stop-typing", async ({ chatId, userId }) => {
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

    socket.on(
      "send-notification",
      async ({ userId, notification, chatId, sender }) => {
        console.log(
          `Notification from sender ${sender} for user ${userId} in chat ${chatId}:`,
          notification
        );

        // If the target user is online, send the notification directly
        if (users.has(userId)) {
          const receiverSocketId = users.get(userId);
          io.to(receiverSocketId).emit("new-notification", {
            notification,
            chatId,
            sender,
          });
        } else {
          // Otherwise, store the notification for later retrieval
          if (!notifications.has(userId)) {
            notifications.set(userId, []);
          }
          notifications.get(userId).push({ notification, chatId, sender });
        }
      }
    );

    socket.on("check-notifications", ({ userId }) => {
      if (notifications.has(userId)) {
        const userNotifications = notifications.get(userId);
        socket.emit("new-notification", userNotifications);
        notifications.delete(userId); 
      } else {
        socket.emit("new-notification", []);
      }
    });

    //  Handle Disconnect
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
