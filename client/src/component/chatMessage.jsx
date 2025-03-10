// import { Phone, Search, Video } from "lucide-react";

import { Phone, Search, Video } from "lucide-react";

export default function Chat(){
    return(
        <>
        <div className="chat-messages">
            <header>
                <div className="header">
                    <h2>Eman Wael</h2>
                    <div className="parent-Icon">
                        <div className="child-icon">
                            <Video size={20}/>
                        </div>
                        <div className="child-icon">
                            <Phone size={20}/>
                        </div>
                        <div >
                            <Search size={20}/>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="sender">
                    <p className="message"> Hello, I miss U</p>
                </div>
                <div className="receiver">
                    <p className="message">Hi! I miss U too</p>
                </div>
            </main>
            <footer>
                <div className="footer">
                    <input type="text" placeholder="Type a message"/>
                </div>
            </footer>
        </div>
        </>
    )
}