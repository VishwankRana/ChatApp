import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [userId, setUserId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const joinRoom = () => {
    if (userId === "user1" || userId === "user2") {
      socket.emit("join_room", userId);
      setJoined(true);
    } else {
      alert("Enter user1 or user2 only");
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {
        user: userId,
        text: message,
      });
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold">Private Chat</h2>
        </div>

        {!joined ? (
          /* Join Section */
          <div className="flex flex-col items-center justify-center flex-1 p-6 gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user1 or user2"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button
              onClick={joinRoom}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.user === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl shadow ${
                      msg.user === userId
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-300 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
