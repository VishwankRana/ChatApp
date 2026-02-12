import { useState, useEffect } from "react";
import Socket from "../Socket";
import InputBar from "./InputBar";

export default function ChatPage({ activeChat }) {
  const [messages, setMessages] = useState([]);

  // 1️⃣ Fetch old messages ONCE
  useEffect(() => {
    fetch("http://localhost:5000/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  useEffect(() => {
    Socket.on("connect", () => {
      console.log("Connected to server:", Socket.id);
    });
  }, []);

  // 2️⃣ Join when activeChat changes
  useEffect(() => {
    if (activeChat) {
      Socket.emit("join", activeChat);
    }
  }, [activeChat]);

  // 3️⃣ Listen for new messages
  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    Socket.on("message", handleMessage);

    return () => {
      Socket.off("message", handleMessage);
    };
  }, []);

  // 4️⃣ Only send message (do NOT join here)
  const sendMessage = (text) => {
    if (!text.trim()) return;
    Socket.emit("message", text);
  };

  return (
    <div className="h-[41.3em] w-full bg-gray-900 rounded-xl ml-5 flex flex-col">
      <div className="text-white text-2xl font-semibold border-b border-gray-700 p-3.5">
        <h1>{activeChat}</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-white space-y-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <InputBar onSend={sendMessage} />
    </div>
  );
}
