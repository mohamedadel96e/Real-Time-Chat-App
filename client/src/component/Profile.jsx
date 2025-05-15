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
  const [isUploading, setIsUploading] = useState(false);

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

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("profilePic", file);

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
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload photo");
      }

      const updatedUser = await response.json();
      
      // Update localStorage with the new user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserData));
      
      // Update local state
      setUser(newUserData);
    } catch (error) {
      console.error("Photo upload error:", error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full rounded-r-lg p-6 bg-gray-900">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl text-white">Profile</h1>
        {isUploading && (
          <div className="flex items-center gap-2 text-blue-400">
            <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-gray-700 transition-all duration-300 group-hover:ring-blue-500">
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Icon icon={"majesticons:user-circle"} className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>
          <label 
            htmlFor="photo-upload" 
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-1">
              <Icon icon="majesticons:camera" className="w-6 h-6 text-white" />
              <span className="text-white text-xs font-medium">Change Photo</span>
            </div>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        <div className="w-full space-y-4">
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
      </div>
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
        <p className="text-gray-400 text-sm mb-1">{label}</p>
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
          <h2 className="font-semibold text-lg text-white">{value}</h2>
        ) : (
          <p className="text-gray-300">{value}</p>
        )}
      </div>

      <Icon
        icon="majesticons:edit-pen-2"
        className="w-5 h-5 cursor-pointer hover:opacity-70 transition-all text-gray-400 hover:text-white"
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
}