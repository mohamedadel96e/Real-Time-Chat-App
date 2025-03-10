import { useState } from "react";
import Call from "../component/call";
import CallContent from "../component/callContent";
import CallItems from "../component/callitem";
import Sidebar from "../component/sidebar";

export default function Calls() {
    const [callId, setCallId] = useState(null)
    return (
        <>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <CallItems />
                {
                    callId == null ?  <CallContent/> : <Call />
                }
        
                
            </div>
        </>
    )
}