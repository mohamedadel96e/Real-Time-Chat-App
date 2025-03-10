// import { MessageCircleMore, Phone, PhoneIncomingIcon, Video, X } from "lucide-react";

import { MessageCircleMore, Phone, PhoneIncomingIcon, Video } from "lucide-react";

export default function Call() {
    return (
        <>
            <div className="call-info">
                <div className="header">
                    <h2>Call info</h2>
                    <div>
                        <X size={20} />
                    </div>
                </div>
                <div className="content-title">
                    <div>
                        <h3>Eman Wael</h3>
                    </div>
                    <div className="icon">
                        <MessageCircleMore size={20} />
                        <Video size={20}/>
                        <Phone size={18}/>
                    </div>
                </div>
                <div className="call-date">
                    <p>Friday</p>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{display:"flex" ,alignItems:"center"}}> 
                            <PhoneIncomingIcon size={14} color="brown"/>
                            <p style={{fontSize:"14px" ,marginLeft:"5px"}}>Missed voice call at 2:00 AM</p>
                        </div>
                        <p style={{fontSize:"14px"}}>Unanswered</p>
                    </div>
                </div>
            </div>
        </>
    )
}