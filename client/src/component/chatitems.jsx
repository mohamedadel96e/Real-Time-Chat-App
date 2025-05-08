import { useState } from "react";
import userImg from "../assets/images/user.png";

export default function ChatItems({ conversations = [], onSelectChat, classRes }) {
  const [selectedId, setSelectedId] = useState(null);

  // Process the API data to match the expected format while keeping your original styling
  const chatList = conversations.map(chat => {
    // Get the other member (not admin) for personal chats
    const user = JSON.parse(localStorage.getItem("user"));
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

  function formatTimestamp(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const handleSelect = (chat) => {
    setSelectedId(chat.id);
    onSelectChat(chat.id); 
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
            <img
              src={chat.avatar}
              alt={chat.name}
              style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userImg;
              }}
            />
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