import { Phone, Search, SendHorizonalIcon, Video } from "lucide-react";
import { conversations } from "../data/fakeChatData";
import { useState } from "react";

export default function Chat({ id , classRes}) {
    const [inputValue, setInputValue]=useState("")
 
  // البحث عن المحادثة المحددة باستخدام الـ ID
  const selectedChat = conversations.find(chat => chat.id === id);
  const [messages, setMessages]=useState([])
  // إذا لم يتم العثور على المحادثة، عرض رسالة
  if (!selectedChat) {
    return <div className="chat-messages">Select a chat to start messaging</div>;
  }
  const handleClick=()=>{
    if (inputValue.trim=="") return;
    const mes=selectedChat.messages;
    mes.push(
        {
            content:inputValue,
            type:"sender",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    )
    setMessages([...messages, mes])
    setInputValue("")
  }
  return (
    <div className={"chat-messages "+ classRes}>
      <header>
        <div className="header">
          <h2 style={{display:"flex", alignItems:"center" , fontSize:"16px"}}><img src={selectedChat.avatar} style={{width:"30px", height:"30px", borderRadius:"50%" , marginRight:"10px"}}/>{selectedChat.name}</h2>
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
      <main  >
        {selectedChat.messages.map((message, index) => (
          <div key={index} className={message.type === "sender" ?  "receiver" :"sender"}>
            <p className="message">
              {message.content} 
              <span style={{color:"gray", fontSize:"8px", padding:"0px 5px"}}>
                {message.time}
              </span>
            </p>
          </div>
        ))}
      </main>
      <footer>
        <div className="footer">
          <input value={inputValue} type="text" placeholder="Type a message" onChange={(e)=>{setInputValue(e.target.value)}} />
          <span style={{cursor:"pointer"}} onClick={handleClick}><SendHorizonalIcon/></span >
        </div>
      </footer>
    </div>
  );
}