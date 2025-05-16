import { Server } from "socket.io";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Maps to track users and notifications
const users = new Map(); // Track online users (userId -> socketId)
const notifications = new Map(); // Track unread messages (userId -> notifications[])
const userChatRooms = new Map(); // Track which chat rooms each user is in (userId -> Set of chatIds)

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

  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN, // Change this to match your client URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // 1️⃣ User Online/Offline Tracking
    socket.on("user-online", async (userId) => {
      if (!userId) return;

      try {
        users.set(userId, socket.id);

        // Set user's socketId in their object for later reference
        socket.userId = userId;

        // Initialize the set of chat rooms for this user if it doesn't exist
        if (!userChatRooms.has(userId)) {
          userChatRooms.set(userId, new Set());
        }

        // Update user status in database
        await User.findByIdAndUpdate(userId, { status: "online" });

        // Broadcast to all clients that this user is online
        io.emit("update-user-status", { userId, status: "online" });

        console.log(`User ${userId} is now online with socket ${socket.id}`);

        // Check if there are any pending notifications for this user
        if (notifications.has(userId)) {
          const userNotifications = notifications.get(userId);
          socket.emit("new-notification", userNotifications);
          notifications.delete(userId); // Clear after sending
        }
      } catch (error) {
        console.error("Error in user-online handler:", error);
      }
    });

    socket.on("user-offline", async (userId) => {
      if (!userId) return;

      try {
        users.delete(userId);

        // Update user status in database
        await User.findByIdAndUpdate(userId, {
          status: "offline",
          lastSeen: new Date(),
        });

        // Broadcast to all clients that this user is offline
        io.emit("update-user-status", { userId, status: "offline" });

        // Clean up user's chat rooms
        userChatRooms.delete(userId);

        console.log(`User ${userId} is now offline`);
      } catch (error) {
        console.error("Error in user-offline handler:", error);
      }
    });

    // 2️⃣ Sending Messages with Attachments
    socket.on(
      "send-message",
      async ({ sender, chatId, text, attachments = [] }) => {
        try {
          console.log("New message:", { sender, chatId, text });

          // Create new message in database
          const newMessage = await Message.create({
            sender,
            chat: chatId,
            text,
            attachments,
            seenBy: [sender], // Mark as seen by sender automatically
          });

          // Update chat with the new message
          await Chat.findByIdAndUpdate(chatId, {
            $push: { messages: newMessage._id },
            $set: { updatedAt: new Date() },
          });

          // Populate the sender details for the frontend
          const messageData = await newMessage.populate(
            "sender",
            "name username profilePic"
          );

          // Send to all users in the chat room
          io.to(chatId.toString()).emit("new-message", messageData);

          // Get all members of the chat
          const chat = await Chat.findById(chatId).populate("members", "_id");

          // Send notifications to offline users or users not in this chat
          if (chat && chat.members) {
            for (const member of chat.members) {
              const memberId = member._id.toString();

              // Skip the sender
              if (memberId === sender) continue;

              // Check if member is online
              const memberSocketId = users.get(memberId);

              if (memberSocketId) {
                // Check if member is in this chat room
                const memberRooms = userChatRooms.get(memberId) || new Set();

                if (!memberRooms.has(chatId.toString())) {
                  // User is online but not in this chat room, send notification
                  io.to(memberSocketId).emit("new-notification", {
                    notification: `New message from ${chat.name || "Chat"}`,
                    chatId,
                    sender,
                    text:
                      text.substring(0, 50) + (text.length > 50 ? "..." : ""),
                  });
                }
              } else {
                // User is offline, store notification for later
                if (!notifications.has(memberId)) {
                  notifications.set(memberId, []);
                }

                notifications.get(memberId).push({
                  notification: `New message from ${chat.name || "Chat"}`,
                  chatId,
                  sender,
                  text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
                });
              }
            }
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    // 3️⃣ Mark Messages as Read (SeenBy)
    socket.on("mark-as-read", async ({ userId, chatId }) => {
      try {
        if (!userId || !chatId) return;

        // Update all unread messages in this chat to mark as read by this user
        const result = await Message.updateMany(
          { chat: chatId, seenBy: { $ne: userId } },
          { $addToSet: { seenBy: userId } }
        );

        // Notify others that messages have been read
        io.to(chatId.toString()).emit("update-seen", { chatId, userId });

        console.log(
          `User ${userId} marked ${result.modifiedCount} messages as read in chat ${chatId}`
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // 4️⃣ Typing Indicators
    socket.on("typing", ({ chatId, userId }) => {
      if (!chatId || !userId) return;
      socket.to(chatId.toString()).emit("typing", { userId, chatId });
    });

    socket.on("stop-typing", ({ chatId, userId }) => {
      if (!chatId || !userId) return;
      socket.to(chatId.toString()).emit("stop-typing", { userId, chatId });
    });

    // 5️⃣ Join Chat Room
    socket.on("join-chat", async ({ chatId }) => {
      try {
        if (!chatId) return;

        const chatRoomId = chatId.toString();
        // Join the socket room for this chat
        socket.join(chatRoomId);

        // Update the user's chat rooms set
        if (socket.userId && userChatRooms.has(socket.userId)) {
          userChatRooms.get(socket.userId).add(chatRoomId);
        }

        // Notify room that user joined
        socket.to(chatRoomId).emit("joined-chat", {
          chatId: chatRoomId,
          userId: socket.userId,
        });
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    });

    // Check for notifications
    socket.on("check-notifications", ({ userId }) => {
      if (!userId) return;

      if (notifications.has(userId)) {
        const userNotifications = notifications.get(userId);
        socket.emit("new-notification", userNotifications);
        notifications.delete(userId); // Clear after sending
      } else {
        socket.emit("new-notification", []);
      }
    });

    // Custom notification handling
    socket.on(
      "send-notification",
      async ({ userId, notification, chatId, sender }) => {
        console.log(
          `Notification for user ${userId} from ${sender}:`,
          notification
        );

        if (!userId || !notification) return;

        // If user is online, send notification directly
        if (users.has(userId)) {
          const receiverSocketId = users.get(userId);
          io.to(receiverSocketId).emit("new-notification", {
            notification,
            chatId,
            sender,
          });
        } else {
          // Store for later retrieval
          if (!notifications.has(userId)) {
            notifications.set(userId, []);
          }

          notifications.get(userId).push({
            notification,
            chatId,
            sender,
          });
        }
      }
    );

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      // Find the userId associated with this socket
      let disconnectedUserId = null;

      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        // Remove user from online users map
        users.delete(disconnectedUserId);

        // Update user status in database
        await User.findByIdAndUpdate(disconnectedUserId, {
          status: "offline",
          lastSeen: new Date(),
        });

        // Clean up user's chat rooms
        userChatRooms.delete(disconnectedUserId);

        // Broadcast to all clients that this user is offline
        io.emit("update-user-status", {
          userId: disconnectedUserId,
          status: "offline",
        });
      }
    });
  });

  return io;
};

export default initializeSocket;
