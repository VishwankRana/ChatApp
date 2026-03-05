import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function Chat({ handleLogout }) {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("token");

  // 🔐 Connect Socket with JWT
  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("receive_private_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, [token]);

  // 📌 Fetch all users
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

    fetchUsers();
  }, [token]);

  // 📌 Open conversation
  const openChat = async (targetUser) => {
    setSelectedUser(targetUser);

    // Create or fetch conversation
    const res = await fetch("http://localhost:5000/api/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: targetUser._id }),
    });

    const conversation = await res.json();
    setRoomId(conversation.roomId);

    // Fetch old messages
    const msgRes = await fetch(
      `http://localhost:5000/api/messages/${conversation.roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const messages = await msgRes.json();

    const formatted = Array.isArray(messages)
      ? messages.map((msg) => ({
          senderId: msg.sender,
          message: msg.text,
          createdAt: msg.createdAt,
        }))
      : [];

    setChat(formatted);

    // Join socket room
    socket?.emit("join_private_chat", {
      targetUserId: targetUser._id,
    });
  };

  // 📤 Send message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket?.emit("send_private_message", {
      targetUserId: selectedUser._id,
      message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Users</h2>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            >
              {user.username}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-blue-600 text-white p-4">
              Chat with {selectedUser.username}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl shadow ${
                      msg.senderId === currentUser.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-900"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                className="flex-1 border rounded px-4 py-2"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
