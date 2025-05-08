import { useState } from "react";

export default function General() {
  const [logoutModal, setLogoutModal] = useState(false);
  function handleLogoutModal() {
    setLogoutModal(!logoutModal);
  }
  function handleLogout() {}

  return (
    <div className="flex flex-col gap-5 h-full w-full rounded-r-lg p-4 overflow-y-auto overflow-x-hidden scrollable-div">
      <h1 className="font-semibold text-xl">General</h1>
      <button
        onClick={handleLogoutModal}
        className="align-middle text-lg flex justify-center items-center mx-auto hover:opacity-80 transition-all"
        style={{
          width: "150px",
          paddingLeft: "0",
          margin: "auto",
          marginTop: "5px",
          marginBottom: "5px",
          backgroundColor: "#bb0000",
        }}
      >
        Logout
      </button>
      {logoutModal && (
        <div className="flex flex-col gap-2 p-6 rounded-md shadow-md text-center">
          <h1>Are you sure?</h1>
          <div className="flex flex-row">
            <button
              onClick={handleLogout}
              className="align-middle text-md flex justify-center items-center mx-auto hover:opacity-80 transition-all"
              style={{
                width: "100px",
                paddingLeft: "0",
                margin: "auto",
                marginTop: "5px",
                marginBottom: "5px",
                backgroundColor: "#161822",
              }}
            >
              Yes
            </button>
            <button
              onClick={handleLogoutModal}
              className="align-middle text-md flex justify-center items-center mx-auto hover:opacity-80 transition-all"
              style={{
                width: "100px",
                paddingLeft: "0",
                margin: "auto",
                marginTop: "5px",
                marginBottom: "5px",
                backgroundColor: "gray",
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
