import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AlignJustify,
  ArchiveRestore,
  ChartPie,
  MessageCircleMore,
  Phone,
  Settings,
  Star,
  UserRoundPen,
} from "lucide-react";
import Configurations from "./Configurations";

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showConfigurations, setShowConfigurations] = useState(false);

  const sidebarItems = [
    { icon: Star, label: "Starred Messages" },
    { icon: ArchiveRestore, label: "Archived Chats" },
    { divider: true },
    { icon: Settings, label: "Settings" },
    { icon: UserRoundPen, label: "Profile" },
  ];

  function handleToggle() {
    setIsOpened((prev) => !prev);
  }

  function handleTabClick(label) {
    setActiveTab(label);
    setShowConfigurations(label === "Settings" || label === "Profile");
  }

  function handleClose() {
    setShowConfigurations(false);
    setActiveTab("");
  }

  return (
    <div className={`side-bar ${isOpened ? "" : "closed"}`}>
      <div className="side-bar-child">
        <AlignJustify onClick={handleToggle} style={{ cursor: "pointer" }} />
      </div>

      <div className="side-bar-child">
        <NavLink to="/main">
          <MessageCircleMore size={20} />
          <span>Chats</span>
        </NavLink>
      </div>

      <div className="side-bar-child">
        <NavLink to="/calls">
          <Phone size={20} />
          <span>Call</span>
        </NavLink>
      </div>

      <div className="side-bar-child">
        <ChartPie size={20} />
        <span>Status</span>
      </div>

      <hr className="opacity-10 mx-2" />

      <div>
        {sidebarItems.map((item, index) =>
          item.divider ? (
            <hr key={index} className="opacity-10 mx-2" />
          ) : (
            <div
              key={index}
              className={`px-3 py-2 rounded cursor-pointer hover:bg-[#2c2c2c] flex items-center gap-2 ${
                activeTab === item.label ? "bg-[#2c2c2c]" : ""
              }`}
              onClick={() => handleTabClick(item.label)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          )
        )}
      </div>

      {showConfigurations && (
        <Configurations currentTab={activeTab} onClose={handleClose} />
      )}
    </div>
  );
}
