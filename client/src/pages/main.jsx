import { useState, useEffect } from "react";
import ChatItems from "../component/chatitems";
import Chat from "../component/chatMessage";
import ChatContent from "../component/chatsContent";
import Sidebar from "../component/sidebar";
import { useNavigate } from "react-router-dom";
import { initSocket, disconnectSocket, checkNotifications } from "../utils/socket";

export default function Main() {
  const [chatId, setChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Initialize socket connection when component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    // Initialize socket connection
    const socket = initSocket(user.id);

    // Listen for new messages and update the conversations
    socket.on("new-message", (message) => {
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv._id === message.chat) {
            return {
              ...conv,
              messages: [...(conv.messages || []), message._id],
              updatedAt: new Date().toISOString()
            };
          }
          return conv;
        });
      });

      // If the message is in the current chat, refresh messages
      if (chatId === message.chat) {
        // The message will be picked up by the useEffect in the Chat component
      }
    });

    // Listen for notifications
    socket.on("new-notification", (newNotifications) => {
      if (Array.isArray(newNotifications) && newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else if (newNotifications && typeof newNotifications === 'object') {
        setNotifications(prev => [...prev, newNotifications]);
      }
    });

    // Check for any missed notifications
    checkNotifications(user.id);

    // Clean up socket connection when component unmounts
    return () => {
      disconnectSocket(user.id);
    };
  }, [navigate]);

  // Fetch chats when component mounts
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage or cookies
        const token = localStorage.getItem('token') || 
                      document.cookie.split('; ')
                        .find(row => row.startsWith('token='))
                        ?.split('=')[1];

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5010/api/chats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch chats');
        }

        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message || 'Network error occurred');
        
        // If it's an authentication error, redirect to login
        if (error.message.includes('401') || error.message.includes('403')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  // Refresh chats periodically to catch any missed updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5010/api/chats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Error refreshing chats:', error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div className="loading">Loading chats...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div>
        <ChatItems 
          conversations={conversations} 
          onSelectChat={setChatId} 
          classRes={chatId ? 'ChatItemsClosed' : 'ChatItemsOpened'} 
          notifications={notifications}
        />
      </div>
    
      {chatId == null ? (
        <ChatContent />
      ) : (
        <Chat 
          id={chatId}
          chatData={conversations.find(c => c._id === chatId)}
          classRes={!chatId ? 'chat-messagesClosed' : 'chat-messagesOpened'} 
          setConversations={setConversations}
        />
      )}
    </div>
  );
}