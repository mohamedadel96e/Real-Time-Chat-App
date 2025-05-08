import { useState } from "react";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese (Mandarin)",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Bengali",
  "Russian",
  "Japanese",
  "Punjabi",
  "Javanese",
  "Korean",
  "Telugu",
  "Vietnamese",
  "Marathi",
  "Tamil",
  "Urdu",
  "Turkish",
  "Italian",
  "Thai",
  "Gujarati",
  "Persian",
  "Polish",
  "Ukrainian",
  "Malayalam",
  "Kannada",
  "Odia",
  "Burmese",
  "Dutch",
  "Swedish",
  "Greek",
  "Czech",
  "Hungarian",
  "Danish",
  "Finnish",
  "Hebrew",
  "Swahili",
  "Zulu",
  "Xhosa",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Somali",
  "Amharic",
  "Tigrinya",
  "Nepali",
  "Sinhala",
  "Khmer",
  "Lao",
  "Mongolian",
  "Tibetan",
  "Uyghur",
  "Kazakh",
  "Kurdish",
  "Pashto",
  "Dari",
  "Tajik",
  "Azerbaijani",
  "Georgian",
  "Armenian",
  "Basque",
  "Catalan",
  "Galician",
  "Welsh",
  "Irish",
  "Scottish Gaelic",
  "Maori",
  "Hawaiian",
  "Samoan",
  "Tongan",
  "Fijian",
  "Tahitian",
  "Cherokee",
  "Navajo",
  "Inuktitut",
  "Cree",
  "Quechua",
  "Guarani",
  "Aymara",
  "Mapudungun",
  "Sanskrit",
  "Latin",
  "Esperanto",
];

export default function General() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col gap-5 h-full w-full rounded-r-lg p-4 overflow-y-auto overflow-x-hidden scrollable-div">
      <h1 className="font-semibold text-xl">General</h1>
      <h2 className="text-lg">Login</h2>
      <div className="w-full flex flex-row justify-between items-center">
        <p className="text-sm opacity-75">Start Chat App at Login</p>
        <Switch />
      </div>
      <h2>Language</h2>
      <div className="relative w-64">
        <select
          name="language"
          id="language"
          className="block appearance-none w-full bg-[#0f1522] text-white border border-gray-900 py-3 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none hover:border-gray-400 transition-all duration-200"
        >
          <option value="" disabled selected>
            Select a language
          </option>
          {languages.map((lang) => (
            <option key={lang} value={lang} className="text-gray-300">
              {lang}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <h2>Typing</h2>
      <p className="text-sm">
        Change typing setting for autocorrect and misspelled highlight from
        Windows Setting
      </p>
      <h3>Replace text with emoji</h3>
      <div className="flex flex-row gap-3">
        <p>Emoji will replace specific text as you type</p>
        <Switch />
      </div>
      <hr className="opacity-50" />
      <p>To log out of Chat App on this computer go to your Profile</p>
    </div>
  );
}

function Switch({ label }) {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center">
      {label && <label className="mr-2">{label}</label>}
      <div
        className={`p-1 relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
          isOn ? "bg-green-500" : "bg-gray-400"
        }`}
        onClick={toggleSwitch}
      >
        <div
          className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${
            isOn ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
    </div>
  );
}
