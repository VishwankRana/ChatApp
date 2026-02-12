import { useState } from "react";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="border-t border-gray-700 p-3 flex items-center gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-gray-600"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
      >
        Send
      </button>
    </div>
  );
}
