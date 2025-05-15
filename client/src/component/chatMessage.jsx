import {Phone, Search, SendHorizonalIcon, Video} from "lucide-react";
import {useState, useEffect, useRef} from "react";
import userImg from "../assets/images/user.png";
import { joinChatRoom, markMessagesAsRead, sendMessage, startTyping, stopTyping, getSocket } from "../utils/socket";

export default function Chat({id, chatData, classRes, setConversations}) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [typingTimeout, setTypingTimeoutState] = useState(null);
  const messagesEndRef = useRef(null);

  // Format timestamp
  function formatTimestamp(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Get current user and determine the other chat member
  const user = JSON.parse(localStorage.getItem("user"));
  const otherMember =
    chatData.members[0]?._id !== user.id
      ? chatData.members[0]
      : chatData.members[1];
  
  // Format conversation data
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

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Join chat room and set up socket listeners when chat is selected
  useEffect(() => {
    // Join the chat room when the component mounts or chat ID changes
    if (id) {
      joinChatRoom(id);
      markMessagesAsRead(user.id, id);
    }

    // Set up socket listeners
    const socket = getSocket();
    if (socket) {
      // Listen for new messages
      socket.on("new-message", (message) => {
        if (message.chat === id) {
          setMessages(prev => [...prev, message]);
          
          // Update the conversations list to reflect the new message
          setConversations(prev => 
            prev.map(conv => 
              conv._id === id 
                ? {...conv, messages: [...(conv.messages || []), message._id]} 
                : conv
            )
          );
        }
      });

      // Listen for typing indicators
      socket.on("typing", ({ userId, chatId }) => {
        if (chatId === id && userId !== user.id) {
          // Find user name
          const typingUserObj = chatData.members.find(member => member._id === userId);
          setTypingUser(typingUserObj?.name || "Someone");
          setIsTyping(true);
        }
      });

      socket.on("stop-typing", ({ userId, chatId }) => {
        if (chatId === id && userId !== user.id) {
          setIsTyping(false);
        }
      });

      // Mark messages as read when received
      socket.on("update-seen", ({ chatId, userId }) => {
        if (chatId === id && userId !== user.id) {
          // Update UI to show message has been read
          console.log("Message seen by:", userId);
        }
      });
    }

    // Clean up listeners when component unmounts or chat ID changes
    return () => {
      if (socket) {
        socket.off("new-message");
        socket.off("typing");
        socket.off("stop-typing");
        socket.off("update-seen");
      }
    };
  }, [id, user.id, setConversations]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
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
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMessages();
    }
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing events
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping(id, user.id);
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setIsTyping(false);
      stopTyping(id, user.id);
    }, 2000);
    
    setTypingTimeoutState(timeout);
  };

  // Send message via socket
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Emit stop typing
    stopTyping(id, user.id);
    setIsTyping(false);

    const messageData = {
      sender: user.id,
      chatId: id,
      text: inputValue,
    };

    try {
      // Send message both through socket and API
      sendMessage(messageData);
  
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle keydown event for sending messages
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div className="chat-messages">Loading...</div>;
  }

  if (!messages.length) {
    return (
      <div className="chat-messages" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <span style={{ color: '#aaa', fontSize: '18px', textAlign: 'center' }}>No messages found for this chat</span>
        </div>
        <footer style={{ width: '100%' }}>
          <div className="footer">
            <input
              value={inputValue}
              type="text"
              placeholder="Type a message"
              onChange={(e) => {
                setInputValue(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
            />
            <span className="send-button" onClick={handleSendMessage}>
              <SendHorizonalIcon />
            </span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={"chat-messages " + classRes}>
      <header>
        <div className="header">
          <h2 className="chat-header">
            <img
              src={conversations.avatar}
              alt={conversations.name}
              className="chat-avatar"
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
      <main className="messages-container">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={message.sender._id === user.id ? "receiver" : "sender"}
          >
            <p className="message">
              {message.text}
              <span className="message-time">
                {formatTimestamp(message.updatedAt)}
              </span>
            </p>
          </div>
        ))}
        
        {isTyping && typingUser && (
          <div className="typing-indicator">
            <p>{typingUser} is typing...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>
      <footer>
        <div className="footer">
          <input
            value={inputValue}
            type="text"
            placeholder="Type a message"
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="send-button" onClick={handleSendMessage}>
            <SendHorizonalIcon />
          </span>
        </div>
      </footer>
    </div>
  );
}