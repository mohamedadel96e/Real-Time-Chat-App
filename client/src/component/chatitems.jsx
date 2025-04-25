import { useState } from "react";
import userImg from "../assets/images/user.png";
import { conversations } from "../data/fakeChatData";

export default function ChatItems({ onSelectChat,classRes }) {
  const [selectedId, setSelectedId] = useState(null);
//   const [lastMessage, setLatMessage]=useState("")
  // إنشاء مصفوفة مختصرة للعرض في القائمة الجانبية
  const chatList = conversations.map(chat => ({
    id: chat.id,
    name: chat.name,
    // lastMessage: chat.lastMessage,
    lastMessage:chat.messages?.[chat.messages.length - 1]?.content || "",
    timestamp: chat.timestamp,
    unreadCount: chat.unreadCount,
    isRead: chat.isRead,
    avatar: chat.avatar || userImg
  }));

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
              style={{ borderRadius: "50%", width: "40px", height: "40px" }}
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