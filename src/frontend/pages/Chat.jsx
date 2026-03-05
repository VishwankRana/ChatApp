import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function Chat({ handleLogout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  let currentUser = null;
  try {
    if (userString && userString !== "undefined") {
      currentUser = JSON.parse(userString);
    }
  } catch {
    // Invalid JSON in localStorage, ignore and use null
  }

  // Socket connection
  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("receive_private_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    window.socket = newSocket;

    return () => newSocket.disconnect();
  }, [token]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    };

    if (token) fetchUsers();
  }, [token]);

  // Open chat
  const openChat = async (targetUser) => {
    setSelectedUser(targetUser);

    const res = await fetch("http://localhost:5000/api/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: targetUser._id }),
    });

    const conversation = await res.json();

    const msgRes = await fetch(
      `http://localhost:5000/api/messages/${conversation.roomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const messages = await msgRes.json();

    const formatted = Array.isArray(messages)
      ? messages.map((msg) => ({
          senderId: msg.sender,
          message: msg.text,
        }))
      : [];

    setChat(formatted);

    window.socket?.emit("join_private_chat", {
      targetUserId: targetUser._id,
    });
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    window.socket?.emit("send_private_message", {
      targetUserId: selectedUser._id,
      message,
    });

    setMessage("");
  };

  return (
    <div className="h-screen flex bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className={`p-3 cursor-pointer border-b border-gray-800 hover:bg-gray-800 ${
                selectedUser?._id === user._id ? "bg-gray-800" : ""
              }`}
            >
              <div className="font-medium">{user.username}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900 font-semibold">
              {selectedUser.username}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-950">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === currentUser?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs ${
                      msg.senderId === currentUser?._id
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900 flex gap-3">
              <input
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 px-5 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
