import React from "react";

export default function Help() {
  return (
    <div className="flex flex-col gap-5 h-full w-full rounded-r-lg p-4 overflow-y-auto overflow-x-hidden scrollable-div">
      <h1 className="font-semibold text-xl">Help</h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h2 className="text-lg font-medium">Real time chat app</h2>
          <p className="text-sm text-gray-400">Version 2.2.3</p>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-medium">Contact us</h2>
          <p className="text-sm text-gray-400">
            We'd like to know your thoughts about this app.
          </p>
        </div>
        <div>
          <div className="flex flex-col space-y-1">
            <a
              href="https://github.com/ahmedelsherbiny0"
              target="_blank"
              className="text-[#536ca3] hover:underline"
            >
              Contact us
            </a>
          </div>
        </div>

        <div className="text-sm text-gray-500 pt-4 border-t border-gray-700">
          2025 © Real time chat app Inc.
        </div>
      </div>
    </div>
  );
}
