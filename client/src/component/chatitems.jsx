import { useState, useEffect } from "react";
import userImg from "../assets/images/user.png";
import { getSocket } from "../utils/socket";

export default function ChatItems({
  conversations = [],
  onSelectChat,
  classRes,
  notifications = [],
  setConversations,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Process notifications and update unread counts
  useEffect(() => {
    if (notifications.length > 0) {
      // Map through conversations and update unread counts based on notifications
      const updatedChatList = chatList.map((chat) => {
        const chatNotifications = notifications.filter(
          (n) => n.chatId === chat.id
        );
        if (chatNotifications.length > 0) {
          return {
            ...chat,
            unreadCount: (chat.unreadCount || 0) + chatNotifications.length,
            isRead: false,
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
    const processedChats = conversations.map((chat) => {
      // Get the other member (not current user) for personal chats
      const otherMember =
        chat.members && chat.members.length > 1
          ? chat.members.find((m) => m._id !== user.id)
          : null;
      // Find the last message (if messages are populated as objects)
      let lastMessage = "";
      if (Array.isArray(chat.messages) && chat.messages.length > 0) {
        const lastMsgObj = chat.messages[chat.messages.length - 1];
        lastMessage = lastMsgObj.text || "";
      }
      return {
        id: chat._id,
        name: otherMember ? otherMember.name : "",
        lastMessage,
        timestamp: formatTimestamp(chat.updatedAt),
        unreadCount: chat.unreadCount || 0,
        isRead: chat.isRead !== false,
        avatar:
          otherMember && otherMember.profilePic
            ? otherMember.profilePic
            : userImg,
      };
    });

    setChatList(processedChats);
  }, [conversations]);

  // Add debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Handle search functionality with debo  uncing
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const token =
        localStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("Searching for:", query);

      const response = await fetch(
        `http://localhost:5010/api/users/search?email=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search users");
      }

      const data = await response.json();
      console.log("Search results:", data);
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Create debounced search function
  const debouncedSearch = debounce(handleSearch, 300);

  // Create new chat with selected user
  const createChat = async (userId) => {
    try {
      setError(null);
      const token =
        localStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Find the selected user from search results
      const selectedUser = searchResults.find((user) => user._id === userId);
      if (!selectedUser) {
        throw new Error("Selected user not found");
      }

      const response = await fetch("http://localhost:5010/api/chats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: selectedUser.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create chat");
      }

      const chat = await response.json();

      // Add the new chat to conversations
      setConversations((prev) => [...prev, chat]);

      // Select the new chat
      onSelectChat(chat._id);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Create chat error:", error);
      setError(error.message);
    }
  };

  // Listen for user status updates
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("update-user-status", ({ userId, status }) => {
        // Update user status in chat list
        setChatList((prevChatList) => {
          return prevChatList.map((chat) => {
            // Check if this chat involves the user whose status changed
            const otherUser = JSON.parse(localStorage.getItem("user"));
            if (
              chat.members &&
              chat.members.some(
                (member) => member._id === userId && member._id !== otherUser.id
              )
            ) {
              return { ...chat, status };
            }
            return chat;
          });
        });
      });

      // Listen for new messages to update last message and unread count
      socket.on("new-message", (message) => {
        setChatList((prevChatList) => {
          return prevChatList.map((chat) => {
            if (chat.id === message.chat) {
              // If this chat is not currently selected, increment unread count
              const shouldIncrement = chat.id !== selectedId;
              return {
                ...chat,
                lastMessage: message.text,
                timestamp: formatTimestamp(new Date()),
                unreadCount: shouldIncrement ? (chat.unreadCount || 0) + 1 : 0,
                isRead: !shouldIncrement,
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const handleSelect = (chat) => {
    setSelectedId(chat.id);
    onSelectChat(chat.id);

    // Reset unread count when selecting a chat
    setChatList((prevChatList) => {
      return prevChatList.map((c) => {
        if (c.id === chat.id) {
          return { ...c, unreadCount: 0, isRead: true };
        }
        return c;
      });
    });
  };

  return (
    <div className={"ChatItems " + classRes}>
      <div>
        <h2 style={{ margin: "20px 0" }}>Chats</h2>
      </div>
      <div className="search-container">
        <input
          type="search"
          name="search"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch(e);
          }}
          style={{
            width: "95%",
            backgroundColor: "rgb(12, 17, 27)",
            border: "none",
            outline: "none",
            padding: "7px 10px",
            borderRadius: "3px",
            marginBottom: "20px",
            borderBottom: "1px solid var(--main-color)",
            color: "white",
          }}
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      {searchQuery ? (
        <div className="search-results">
          {isSearching ? (
            <div className="loading">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => createChat(user._id)}
              >
                <img
                  src={user.profilePic || userImg}
                  alt={user.name}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = userImg;
                  }}
                />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  {user.status && (
                    <span className={`status-indicator ${user.status}`}>
                      {user.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No users found</div>
          )}
        </div>
      ) : (
        <div className="item-parent flex flex-col gap-2">
          {chatList.map((chat) => (
            <div
              className={`item-child flex items-center p-2.5 cursor-pointer rounded-xl mb-2.5 bg-${
                selectedId === chat.id ? "#2a2f3a" : "transparent"
              } ${selectedId === chat.id ? "active" : ""}`}
              key={chat.id}
              onClick={() => handleSelect(chat)}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
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
                      border: "1px solid white",
                    }}
                  />
                )}
              </div>
              <div
                className="ml-4 flex-1"
                style={{ marginLeft: "15px", flex: 1 }}
              >
                <div className="flex justify-between">
                  <h4 className="truncate max-w-[16ch]">{chat.name}</h4>
                  <span className="text-sm text-[#aaa] pr-3">
                    {chat.timestamp}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    className={`text-sm ${
                      chat.isRead ? "text-gray-400" : "text-white"
                    } truncate max-w-[25ch]`}
                  >
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
      )}
    </div>
  );
}
