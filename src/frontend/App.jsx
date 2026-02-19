import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_private_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_private_message");
    };
  }, []);

  const joinChat = () => {
    if (!username || !targetUser) return;

    socket.emit("join_private_chat", {
      username,
      targetUser,
    });

    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_private_message", {
      username,
      targetUser,
      message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl flex flex-col h-[600px]">
        <div className="bg-blue-600 text-white text-center py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold">Private Chat</h2>
        </div>

        {!joined ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6 gap-4">
            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Chat With"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
            />

            <button
              onClick={joinChat}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Start Chat
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.username === username ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl shadow ${
                      msg.username === username
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                className="flex-1 border rounded-lg px-4 py-2"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
