import React from "react";

export default function Notifications() {
  return (
    <div className="flex flex-col gap-5 h-full w-full rounded-r-lg p-4 overflow-y-auto overflow-x-hidden scrollable-div">
      <h1 className="font-semibold text-xl">Notifications</h1>
      <div className="flex flex-col gap-2">
        <div className="p-3 rounded-xl bg-[#0f1727]">
          <h2 className="font-semibold text-md opacity-80">
            Last time you logged in is{" "}
          </h2>
          <h2 className="font-semibold italic text-sm opacity-80">
            8 May 2025 - 12:15 AM
          </h2>
        </div>
      </div>
    </div>
  );
}
