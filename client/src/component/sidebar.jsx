import { AlignJustify, ArchiveRestore, ChartPie, LockKeyhole, MessageCircleMore, Phone, Settings, Star, UserRoundPen } from "lucide-react";
import { useState } from "react";
import SidebarItem from "./sidebaritem";
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
        <>
            <div className={isOpened ? "side-bar" : " side-bar closed"}>
                <div>

                    <SidebarItem>
                        <AlignJustify onClick={handleToggle} style={{ cursor: "pointer" }} />
                    </SidebarItem>

                    <SidebarItem path={"/main"} desc={"Chats"}>
                        <MessageCircleMore size={20} />
                    </SidebarItem>

                    <SidebarItem path={"/calls"} desc={"Call"}>
                        <Phone size={20} />
                    </SidebarItem>

                    <SidebarItem desc={"Status"}>
                        <ChartPie size={20} />
                    </SidebarItem>

                    <hr style={{ opacity: ".1", margin: "0 10px" }} />
                </div>
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
        </>
    )
}