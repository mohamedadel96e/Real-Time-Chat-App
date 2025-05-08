import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import General from "./General";
import Account from "./Account";
import Profile from "./Profile";
import Chats from "./Chats";
import VideoandVoice from "./VideoandVoice";
import Notifications from "./Notifications";
import Personalization from "./Personalization";
import Storage from "./Storage";
import Shortcuts from "./Shortcuts";
import Help from "./Help";

export default function Configurations({ currentTab, onClose }) {
  const [activeTab, setActiveTab] = useState("General");
  const configRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (configRef.current && !configRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (currentTab === "Settings") {
      setActiveTab("General");
    } else if (currentTab === "Profile") {
      setActiveTab("Profile");
    }
  }, [currentTab]);

  const navItems = [
    { name: "General", icon: "majesticons:monitor-line" },
    { name: "Account", icon: "majesticons:key-line" },
    { name: "Chats", icon: "majesticons:chats-2" },
    { name: "Video & Voice", icon: "majesticons:video-camera-line" },
    { name: "Notifications", icon: "majesticons:bell-line" },
    { name: "Personalization", icon: "majesticons:edit-pen-4-line" },
    { name: "Storage", icon: "majesticons:distribute-vertical-line" },
    { name: "Shortcuts", icon: "majesticons:keyboard-line" },
    { name: "Help", icon: "majesticons:information-circle-line" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "General":
        return <General />;
      case "Account":
        return <Account />;
      case "Chats":
        return <Chats />;
      case "Video & Voice":
        return <VideoandVoice />;
      case "Notifications":
        return <Notifications />;
      case "Personalization":
        return <Personalization />;
      case "Storage":
        return <Storage />;
      case "Shortcuts":
        return <Shortcuts />;
      case "Help":
        return <Help />;
      case "Profile":
        return <Profile />;
      default:
        return <General />;
    }
  };

  return (
    <div
      ref={configRef}
      className="w-[600px] h-[550px] flex flex-row fixed left-16 bottom-3 bg-[#0f1522]/80 backdrop-blur-md shadow-xl border border-[#2a2a2a] rounded-lg z-50 transition-all duration-300"
    >
      <div className="w-[180px] h-full flex flex-col justify-between bg-[#0f1522] p-2 rounded-l-lg">
        <div className="flex flex-col gap-3">
          {navItems.map(({ name, icon }) => (
            <div
              key={name}
              onClick={() => setActiveTab(name)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-md text-gray-300 transition-all duration-200 hover:bg-[#202633] hover:text-white cursor-pointer ${
                activeTab === name ? "bg-[#2b3446] text-white shadow-md" : ""
              }`}
            >
              <Icon icon={icon} className="w-5 h-5" />
              <p className="text-sm font-medium">{name}</p>
            </div>
          ))}
        </div>

        <div
          onClick={() => setActiveTab("Profile")}
          className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-md text-gray-300 transition-all duration-200 hover:bg-[#202633] hover:text-white cursor-pointer ${
            activeTab === "Profile" ? "bg-[#202633] text-white shadow-md" : ""
          }`}
        >
          <Icon icon="majesticons:user-circle" className="w-5 h-5" />
          <p className="text-sm font-medium">Profile</p>
        </div>
      </div>

      <div className="w-[430px] bg-[#1a212c] p-4 rounded-r-lg shadow-inner">
        {renderActiveTab()}
      </div>
    </div>
  );
}
