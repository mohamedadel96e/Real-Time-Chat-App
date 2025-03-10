// import { Video } from "lucide";
// import { Camera, FileVideoIcon, Keyboard, Link, LucideKeyboard, VideoIcon, Videotape } from "lucide-react";

import { Link, LucideKeyboard, VideoIcon } from "lucide-react";

export default function CallContent(){
    return(
        <>
        <div className="call-content">
            <div className="start">
                <div>
                    <div className="div-icon"> <VideoIcon size={30}/> </div>
                    <p style={{textAlign:"center"}}>Start call</p>
                </div>
                <div>
                    <div className="div-icon"> <Link size={30}/> </div>
                    <p style={{textAlign:"center"}}>New call link</p>
                </div>
                <div>
                    <div className="div-icon"> <LucideKeyboard size={30}/> </div>
                    <p style={{textAlign:"center"}}>Call a number</p>
                </div>
            </div>
        </div>
        </>
    )
}