import { useState, useEffect } from "react";
import ChatItems from "../component/chatitems";
import Chat from "../component/chatMessage";
import ChatContent from "../component/chatsContent";
import Sidebar from "../component/sidebar";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const [chatId, setChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        />
      </div>
    
      {chatId == null ? (
        <ChatContent />
      ) : (
        <Chat 
          id={chatId}
          chatData={conversations.find(c => c._id === chatId)}
          classRes={!chatId ? 'chat-messagesClosed' : 'chat-messagesOpened'} 
        />
      )}
    </div>
  );
}