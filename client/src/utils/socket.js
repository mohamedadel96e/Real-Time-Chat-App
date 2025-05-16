import { io } from "socket.io-client";

// Create a socket instance that can be reused across the application
let socket;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:5010", {
      withCredentials: true,
    });

    // Connect and set user as online
    socket.on("connect", () => {
      console.log("Socket connected successfully");
      socket.emit("user-online", userId);
    });

    // Handle disconnect events
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const disconnectSocket = (userId) => {
  if (socket) {
    socket.emit("user-offline", userId);
    socket.disconnect();
    socket = null;
  }
};

export const joinChatRoom = (chatId) => {
  if (socket) {
    socket.emit("join-chat", { chatId });
  }
};

export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit("send-message", messageData);
  }
};

export const markMessagesAsRead = (userId, chatId) => {
  if (socket) {
    socket.emit("mark-as-read", { userId, chatId });
  }
};

export const startTyping = (chatId, userId) => {
  if (socket) {
    socket.emit("typing", { chatId, userId });
  }
};

export const stopTyping = (chatId, userId) => {
  if (socket) {
    socket.emit("stop-typing", { chatId, userId });
  }
};

export const checkNotifications = (userId) => {
  if (socket) {
    socket.emit("check-notifications", { userId });
  }
};

export const getSocket = () => socket;
