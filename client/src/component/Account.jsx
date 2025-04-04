import React from "react";

export default function Account() {
  return (
    <div className="flex flex-col h-full w-full rounded-r-lg p-4 overflow-y-auto overflow-x-hidden scrollable-div">
      <h1 className="font-semibold text-xl">Account</h1>
      <h2 class="text-lg pt-4">Privacy</h2>
      <p class="text-sm italic pt-1">Managed on your phone</p>

      <p className="pt-2">Last Seen and Online</p>
      <p class="text-gray-400">Nobody</p>
      <p class="text-sm text-gray-400">
        If you don't share your Last Seen, you won't be able to see other
        people's Last Seen.
      </p>

      <p className="pt-2">Profile photo</p>
      <p class="text-gray-400">Everyone</p>

      <p className="pt-2">About</p>
      <p class="text-gray-400">Nobody</p>

      <p className="pt-2">Add to groups</p>
      <p class="text-gray-400">Everyone</p>

      <p className="pt-2">Read receipts</p>
      <p class="text-gray-400">Off</p>
      <p class="text-sm text-gray-400">
        Read receipts are always sent for group chats
      </p>

      <div class="pt-4">
        <h2 class="text-lg font-semibold mb-2">Blocked contacts</h2>
        <p class="text-sm text-gray-400 mb-2">Managed on your phone</p>
        <p class="text-sm pt-1 text-gray-400">1 blocked contact</p>
      </div>
    </div>
  );
}
