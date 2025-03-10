// import { AlignJustify, ArchiveRestore, ChartPie, Link, LockKeyhole, MessageCircleMore, Phone, Settings, Star, UserRoundPen } from "lucide-react";
import { AlignJustify, ArchiveRestore, ChartPie, LockKeyhole, MessageCircleMore, Phone, Settings, Star, UserRoundPen } from "lucide-react";
import {  useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const [isOpend, setIsOpened]=useState(false)
    function handleToggle(){
        setIsOpened(!isOpend)
    }
    return (
        <>
            <div className={isOpend?"side-bar":" side-bar closed"}>
                <div>
                    <div className="side-bar-child">
                        <AlignJustify onClick={handleToggle} style={{cursor:"pointer"}} />
                    </div>
                    <div className="side-bar-child">
                        <NavLink to={"/main"}>
                            <MessageCircleMore size={20} />
                            <span>Chats</span>  
                        </NavLink>
                    </div>
                    <div className="side-bar-child">
                        <NavLink to={"/calls"}>
                            <Phone size={20} />
                            <span>Call</span>
                        </NavLink>
                    </div>
                    <div className="side-bar-child">
                        <ChartPie size={20} />
                        <span>Status</span>
                    </div>
                    <hr style={{ opacity: ".1", margin: "0 10px" }} />
                </div>
                <div>
                    <div>
                        <div className="side-bar-child">
                            <LockKeyhole size={20} />
                            <span>Locked Chats</span>
                        </div>
                        <div className="side-bar-child">
                            <Star size={20} />
                            <span>Starred Messages</span>
                        </div>
                        <div className="side-bar-child">
                            <ArchiveRestore size={20} />
                            <span>Archived Chats</span>
                        </div>
                        <hr style={{ opacity: ".1", margin: "0 10px" }} />
                        <div className="side-bar-child">
                            <UserRoundPen size={20} />
                            <span>Profile</span>
                        </div>
                        <div className="side-bar-child">
                            <Settings size={20} />
                            <span>Settings</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}