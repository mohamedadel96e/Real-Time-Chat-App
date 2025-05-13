import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Utility functions
const handleError = (socket, error, eventName) => {
  console.error(`Error in ${eventName}:`, error);
  socket.emit("error", { event: eventName, message: error.message });
};

const emitToUser = (io, userId, event, data) => {
  if (users.has(userId)) {
    const socketId = users.get(userId);
    io.to(socketId).emit(event, data);
  }
};

// Event handlers
const userEvents = (io, socket, users) => ({
  "user-online": async (userId) => {
    try {
      users.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { 
        status: "online",
        lastSeen: new Date()
      });
      io.emit("update-user-status", { userId, status: "online" });
    } catch (error) {
      handleError(socket, error, "user-online");
    }
  },

  "user-offline": async (userId) => {
    try {
      users.delete(userId);
      await User.findByIdAndUpdate(userId, { 
        status: "offline",
        lastSeen: new Date()
      });
      io.emit("update-user-status", { userId, status: "offline" });
    } catch (error) {
      handleError(socket, error, "user-offline");
    }
  },

  "update-user-presence": async ({ userId, status }) => {
    try {
      await User.findByIdAndUpdate(userId, { status });
      io.emit("update-user-status", { userId, status });
    } catch (error) {
      handleError(socket, error, "update-user-presence");
    }
  }
});

const messageEvents = (io, socket, users) => ({
  "send-message": async ({ sender, chatId, text, attachments = [] }) => {
    try {
      const newMessage = await Message.create({
        sender,
        chat: chatId,
        text,
        attachments
      });

      await Chat.findByIdAndUpdate(chatId, {
        $push: { messages: newMessage._id },
        lastMessage: newMessage._id,
        updatedAt: new Date()
      });

      const messageData = await newMessage.populate([
        { path: "sender", select: "username profilePic status" },
        { path: "replyTo", select: "text sender", populate: { path: "sender", select: "username" } }
      ]);

      io.to(chatId).emit("new-message", messageData);

      // Notify offline users
      const chat = await Chat.findById(chatId).populate("participants", "status");
      chat.participants.forEach(participant => {
        if (participant._id.toString() !== sender && participant.status === "offline") {
          emitToUser(io, participant._id, "message-notification", {
            chatId,
            message: messageData
          });
        }
      });
    } catch (error) {
      handleError(socket, error, "send-message");
    }
  },

  "mark-as-read": async ({ userId, chatId, messageIds = [] }) => {
    try {
      const query = messageIds.length > 0 
        ? { _id: { $in: messageIds }, seenBy: { $ne: userId } }
        : { chat: chatId, seenBy: { $ne: userId } };

      await Message.updateMany(query, { 
        $push: { seenBy: userId },
        $set: { lastSeenAt: new Date() }
      });

      io.to(chatId).emit("update-seen", { chatId, userId, messageIds });
    } catch (error) {
      handleError(socket, error, "mark-as-read");
    }
  },

  "delete-message": async ({ messageId, chatId, userId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) throw new Error("Message not found");
      
      if (message.sender.toString() !== userId) {
        throw new Error("Not authorized to delete this message");
      }

      await Message.findByIdAndUpdate(messageId, {
        isDeleted: true,
        text: "This message was deleted",
        attachments: []
      });

      io.to(chatId).emit("message-deleted", { messageId, chatId });
    } catch (error) {
      handleError(socket, error, "delete-message");
    }
  },

  "edit-message": async ({ messageId, chatId, userId, newText }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) throw new Error("Message not found");
      
      if (message.sender.toString() !== userId) {
        throw new Error("Not authorized to edit this message");
      }

      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { 
          text: newText,
          isEdited: true,
          editedAt: new Date()
        },
        { new: true }
      ).populate("sender", "username profilePic");

      io.to(chatId).emit("message-edited", { message: updatedMessage, chatId });
    } catch (error) {
      handleError(socket, error, "edit-message");
    }
  }
});

const chatEvents = (io, socket, users) => ({
  "join-chat": async ({ chatId }) => {
    try {
      const chatRoom = new mongoose.Types.ObjectId(chatId).toString();
      socket.join(chatRoom);
      io.to(chatRoom).emit("joined-chat", { chatId: chatRoom });
    } catch (error) {
      handleError(socket, error, "join-chat");
    }
  },

  "leave-chat": async ({ chatId }) => {
    try {
      socket.leave(chatId);
      io.to(chatId).emit("left-chat", { chatId, userId: socket.id });
    } catch (error) {
      handleError(socket, error, "leave-chat");
    }
  },

  "typing": ({ chatId, userId }) => {
    socket.to(chatId).emit("typing", { userId });
  },

  "stop-typing": ({ chatId, userId }) => {
    socket.to(chatId).emit("stop-typing", { userId });
  }
});

const notificationEvents = (io, socket, users, notifications) => ({
  "send-notification": async ({ userId, notification, chatId, sender }) => {
    try {
      if (users.has(userId)) {
        emitToUser(io, userId, "new-notification", {
          notification,
          chatId,
          sender,
          timestamp: new Date()
        });
      } else {
        if (!notifications.has(userId)) {
          notifications.set(userId, []);
        }
        notifications.get(userId).push({
          notification,
          chatId,
          sender,
          timestamp: new Date()
        });
      }
    } catch (error) {
      handleError(socket, error, "send-notification");
    }
  },

  "check-notifications": ({ userId }) => {
    try {
      const userNotifications = notifications.get(userId) || [];
      socket.emit("new-notification", userNotifications);
      notifications.delete(userId);
    } catch (error) {
      handleError(socket, error, "check-notifications");
    }
  },

  "mark-notification-read": async ({ userId, notificationId }) => {
    try {
      // Implement notification read status in your database if needed
      emitToUser(io, userId, "notification-read", { notificationId });
    } catch (error) {
      handleError(socket, error, "mark-notification-read");
    }
  }
});

const reactionEvents = (io, socket) => ({
  "add-reaction": async ({ messageId, chatId, userId, reaction }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          $addToSet: { reactions: { user: userId, type: reaction } }
        },
        { new: true }
      ).populate("reactions.user", "username profilePic");

      io.to(chatId).emit("message-reaction", {
        messageId,
        chatId,
        reactions: message.reactions
      });
    } catch (error) {
      handleError(socket, error, "add-reaction");
    }
  },

  "remove-reaction": async ({ messageId, chatId, userId, reaction }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          $pull: { reactions: { user: userId, type: reaction } }
        },
        { new: true }
      ).populate("reactions.user", "username profilePic");

      io.to(chatId).emit("message-reaction", {
        messageId,
        chatId,
        reactions: message.reactions
      });
    } catch (error) {
      handleError(socket, error, "remove-reaction");
    }
  }
});

// Export all event handlers
export const initializeSocketEvents = (io, socket, users, notifications) => {
  const events = {
    ...userEvents(io, socket, users),
    ...messageEvents(io, socket, users),
    ...chatEvents(io, socket, users),
    ...notificationEvents(io, socket, users, notifications),
    ...reactionEvents(io, socket)
  };

  // Register all event handlers
  Object.entries(events).forEach(([event, handler]) => {
    socket.on(event, handler);
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    try {
      for (let [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          await User.findByIdAndUpdate(userId, {
            status: "offline",
            lastSeen: new Date()
          });
          io.emit("update-user-status", { userId, status: "offline" });
          break;
        }
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
}; 