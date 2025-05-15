import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [about, setAbout] = useState(user.about || "No Bio Yet");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [error, setError] = useState(null);

  // Update local state when user data changes
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(currentUser);
    setName(currentUser.name || "");
    setEmail(currentUser.email || "");
    setAbout(currentUser.about || "No Bio Yet");
  }, []);

  const updateProfile = async (data) => {
    try {
      setError(null);
      const token = localStorage.getItem('token') || 
                    document.cookie.split('; ')
                      .find(row => row.startsWith('token='))
                      ?.split('=')[1];

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:5010/api/users/me", {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      
      // Update localStorage with the new user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserData));
      
      // Update local state
      setUser(newUserData);
      return updatedUser;
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message);
      throw error;
    }
  };

  const handleSave = async (field, value) => {
    try {
      await updateProfile({ [field]: value });
    } catch (error) {
      // Error is already handled in updateProfile
      console.error(`Error updating ${field}:`, error);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full w-full rounded-r-lg p-4">
      <h1 className="font-semibold text-xl">Profile</h1>
      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}
      <Icon icon={"majesticons:user-circle"} className="w-25 h-25" />
      <EditableField
        label="Name"
        value={name}
        onChange={setName}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        isTitle={true}
        onSave={() => handleSave('name', name)}
      />

      <EditableField
        label="Email"
        value={email}
        onChange={setEmail}
        isEditing={isEditingEmail}
        setIsEditing={setIsEditingEmail}
        onSave={() => handleSave('email', email)}
      />

      <EditableField
        label="About"
        value={about}
        onChange={setAbout}
        isEditing={isEditingAbout}
        setIsEditing={setIsEditingAbout}
        onSave={() => handleSave('about', about)}
      />
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  isEditing,
  setIsEditing,
  onSave,
  isTitle = false,
}) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <p className="opacity-85">{label}</p>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onSave?.();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
                onSave?.();
              }
            }}
            autoFocus
            className="border rounded px-2 py-1 w-80 text-black focus:text-white focus:bg-gray-800"
          />
        ) : isTitle ? (
          <h2 className="font-semibold text-lg">{value}</h2>
        ) : (
          <p>{value}</p>
        )}
      </div>

      <Icon
        icon="majesticons:edit-pen-2"
        className="w-5 h-5 cursor-pointer hover:opacity-70 transition-all"
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
}