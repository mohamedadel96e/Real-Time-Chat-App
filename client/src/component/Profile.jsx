import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function Profile() {
  const [name, setName] = useState("Ahmed Elsherbiny");
  const [about, setAbout] = useState(
    "Machines take me by surprise with great frequency"
  );
  const [email, setEmail] = useState("ahmedelsherbiny@example.com");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  return (
    <div className="flex flex-col gap-5 h-full w-full rounded-r-lg p-4">
      <h1 className="font-semibold text-xl">Profile</h1>
      <Icon icon={"majesticons:user-circle"} className="w-25 h-25" />

      <EditableField
        label="Name"
        value={name}
        onChange={setName}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        isTitle={true}
      />
      <EditableField
        label="Email"
        value={email}
        onChange={setEmail}
        isEditing={isEditingEmail}
        setIsEditing={setIsEditingEmail}
      />
      <EditableField
        label="About"
        value={about}
        onChange={setAbout}
        isEditing={isEditingAbout}
        setIsEditing={setIsEditingAbout}
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
            onBlur={() => setIsEditing(false)}
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
