import { MessageCircle } from "lucide-react";

export default function ChatContent({ classRes }) {
    return (
        <div className={`chat-content ${classRes || ''}`}>
            <div className="start chat-messagesClosed">
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <MessageCircle size={48} style={{ marginBottom: '20px', opacity: 0.6 }} />
                    <h3 style={{ marginBottom: '10px' }}>Welcome to the Chat App</h3>
                    <p>Select a chat from the list to start messaging</p>
                </div>
            </div>
        </div>
    );
}