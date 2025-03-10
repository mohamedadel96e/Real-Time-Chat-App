import { useState } from "react";
import ChatItems from "../component/chatitems";
import Chat from "../component/chatMessage";
import ChatContent from "../component/chatsContent";
import Sidebar from "../component/sidebar";

export default function Main(){
    const [chatId, setChatId]=useState(null)

    return(
        <>
           <div style={{display:"flex"}}>
              <Sidebar/>
              <ChatItems/>
              {
                chatId==null?<ChatContent/>:<Chat/>
              }
              
              {/* <ChatContent/> */}
              {/* <Chat/> */}
           </div>
        </>
    )
}