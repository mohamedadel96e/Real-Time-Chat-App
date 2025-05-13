import { useState, useEffect } from "react";
import userImg from "../assets/images/user.png";
import { getSocket } from "../utils/socket";

export default function ChatItems({ conversations = [], onSelectChat, classRes, notifications = [] }) {
  const [selectedId, setSelectedId] = useState(null);
  const [chatList, setChatList] = useState([]);
  
  // Process notifications and update unread counts
  useEffect(() => {
    if (notifications.length > 0) {
      // Map through conversations and update unread counts based on notifications
      const updatedChatList = chatList.map(chat => {
        const chatNotifications = notifications.filter(n => n.chatId === chat.id);
        if (chatNotifications.length > 0) {
          return {
            ...chat,
            unreadCount: (chat.unreadCount || 0) + chatNotifications.length,
            isRead: false
          };
        }
        return chat;
      });
      setChatList(updatedChatList);
    }
  }, [notifications]);

  // Process the API data to match the expected format while keeping the original styling
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const processedChats = conversations.map(chat => {
      // Get the other member (not current user) for personal chats
      const otherMember = chat.members[0]?._id !== user.id
        ? chat.members[0]
        : chat.members[1];
      
      return {
        id: chat._id,
        name: chat.name || otherMember?.name || 'Unknown Chat',
        lastMessage: chat.messages?.[chat.messages.length - 1]?.text || "",
        timestamp: formatTimestamp(chat.updatedAt),
        unreadCount: chat.unreadCount || 0,
        isRead: chat.isRead !== false, // Default to true if not specified
        avatar: otherMember?.profilePic || userImg
      };
    });
    
    setChatList(processedChats);
  }, [conversations]);

  // Listen for user status updates
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("update-user-status", ({ userId, status }) => {
        // Update user status in chat list
        setChatList(prevChatList => {
          return prevChatList.map(chat => {
            // Check if this chat involves the user whose status changed
            const otherUser = JSON.parse(localStorage.getItem("user"));
            if (chat.members && chat.members.some(member => member._id === userId && member._id !== otherUser.id)) {
              return { ...chat, status };
            }
            return chat;
          });
        });
      });

      // Listen for new messages to update last message and unread count
      socket.on("new-message", (message) => {
        setChatList(prevChatList => {
          return prevChatList.map(chat => {
            if (chat.id === message.chat) {
              // If this chat is not currently selected, increment unread count
              const shouldIncrement = chat.id !== selectedId;
              return {
                ...chat,
                lastMessage: message.text,
                timestamp: formatTimestamp(new Date()),
                unreadCount: shouldIncrement ? (chat.unreadCount || 0) + 1 : 0,
                isRead: !shouldIncrement
              };
            }
            return chat;
          });
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("update-user-status");
        socket.off("new-message");
      }
    };
  }, [selectedId]);

  function formatTimestamp(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const handleSelect = (chat) => {
    setSelectedId(chat.id);
    onSelectChat(chat.id);
    
    // Reset unread count when selecting a chat
    setChatList(prevChatList => {
      return prevChatList.map(c => {
        if (c.id === chat.id) {
          return { ...c, unreadCount: 0, isRead: true };
        }
        return c;
      });
    });
  };

  return (
    <div className={"ChatItems "+ classRes }>
      <div>
        <h2 style={{ margin: "20px 0" }}>Chats</h2>
      </div>
      <input type="search" placeholder="Search or start new chat" />
      <div className="item-parent">
        {chatList.map((chat) => (
          <div
            className={`item-child ${selectedId === chat.id ? "active" : ""}`}
            key={chat.id}
            onClick={() => handleSelect(chat)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedId === chat.id ? "#2a2f3a" : "transparent",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={chat.avatar}
                alt={chat.name}
                style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = userImg;
                }}
              />
              {/* Online status indicator */}
              {chat.status === "online" && (
                <span 
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#4caf50",
                    border: "1px solid white"
                  }}
                />
              )}
            </div>
            <div style={{ marginLeft: "15px", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>{chat.name}</h4>
                <span style={{ fontSize: "12px", color: "#aaa" }}>{chat.timestamp}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "14px", color: chat.isRead ? "#aaa" : "#fff" }}>
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <span
                    style={{
                      background: "#ff4d4f",
                      color: "#fff",
                      borderRadius: "50%",
                      fontSize: "12px",
                      padding: "2px 7px",
                      marginLeft: "10px",
                    }}
                  >
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}