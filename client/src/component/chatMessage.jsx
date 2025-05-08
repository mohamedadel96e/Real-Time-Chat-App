import {Phone, Search, SendHorizonalIcon, Video} from "lucide-react";
import {useState} from "react";
import {useEffect} from "react";
import userImg from "../assets/images/user.png";

export default function Chat({id, chatData, classRes}) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  function formatTimestamp(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  console.log("chatData", chatData);
  const user = JSON.parse(localStorage.getItem("user"));
  const otherMember =
    chatData.members[0]?._id !== user.id
      ? chatData.members[0]
      : chatData.members[1];
  const conversations = {
    id: chatData._id,
    name: chatData.name || otherMember?.name || "Unknown ChatData",
    lastMessage:
      chatData.messages?.[chatData.messages.length - 1]?.text || "",
    timestamp: formatTimestamp(chatData.updatedAt),
    unreadCount: chatData.unreadCount || 0,
    isRead: chatData.isRead !== false, // Default to true if not specified
    avatar: otherMember?.profilePic || userImg,
  };

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await await fetch(
          `http://localhost:5010/api/messages/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
        console.log("messages", data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  if (loading) {
    return <div className="chat-messages">Loading...</div>;
  }

  if (!messages.length) {
    return (
      <div className="chat-messages">
        No messages found for this chat
      </div>
    );
  }

  const handleClick = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      text: inputValue,
      chatId: id,
    };

    try {
      const response = await fetch(
        `http://localhost:5010/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newMessage),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={"chat-messages " + classRes}>
      <header>
        <div className="header">
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            <img
              src={conversations.avatar}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "10px",
                objectFit: "cover",
              }}
            />
            {conversations.name}
          </h2>
          <div className="parent-Icon">
            <div className="child-icon">
              <Video size={20} />
            </div>
            <div className="child-icon">
              <Phone size={20} />
            </div>
            <div>
              <Search size={20} />
            </div>
          </div>
        </div>
      </header>
      <main>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender._id === user.id ? "receiver" : "sender"
            }
          >
            <p className="message">
              {message.text}
              <span
                style={{
                  color: "cyan",
                  fontSize: "11px",
                  padding: "0px 5px 5px 10px",
                }}
              >
                {formatTimestamp(message.updatedAt)}
              </span>
            </p>
          </div>
        ))}
      </main>
      <footer>
        <div className="footer">
          <input
            value={inputValue}
            type="text"
            placeholder="Type a message"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <span style={{cursor: "pointer"}} onClick={handleClick}>
            <SendHorizonalIcon />
          </span>
        </div>
      </footer>
    </div>
  );
}
