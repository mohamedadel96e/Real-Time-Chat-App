import { useState } from "react";
import ChatItems from "../component/chatitems";
import Chat from "../component/chatMessage";
import ChatContent from "../component/chatsContent";
import Sidebar from "../component/sidebar";
import { conversations } from "../data/fakeChatData";

export default function Main() {
  const [chatId, setChatId] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div>
      <ChatItems onSelectChat={(id) => setChatId(id)} classRes={chatId?'ChatItemsClosed':'ChatItemsOpened'} />
      </div>
    
     {chatId == null ? (
      
      <ChatContent  />
    
  ) : (
    <Chat id={chatId} classRes={!chatId?'chat-messagesClosed' : 'chat-messagesOpened'} />
  )}
    
    </div>
  );
}