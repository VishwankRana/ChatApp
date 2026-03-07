import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function Chat({ handleLogout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  let currentUser = null;
  try {
    if (userString && userString !== "undefined") {
      currentUser = JSON.parse(userString);
    }
  } catch {
    currentUser = null;
  }
  const currentUserId = currentUser?._id || currentUser?.id;

  /* Socket connection */
  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
    });

    socket.on("receive_private_message", (data) => {
      setChat((prev) => [
        ...prev,
        {
          senderId: data.senderId,
          message: data.message,
        },
      ]);
    });

    window.socket = socket;

    return () => socket.disconnect();
  }, [token, selectedUser]);

  /* Load contacts */
  useEffect(() => {
    const loadContacts = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load contacts", err);
      }
    };

    loadContacts();
  }, [token]);

  /* Search users */
  const searchUsers = async () => {
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/search?username=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  /* Add contact */
  const addContact = async (contactId) => {
    try {
      await fetch("http://localhost:5000/api/users/add-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactId }),
      });

      setSearch("");
      setSearchResults([]);

      const res = await fetch("http://localhost:5000/api/users/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to add contact", err);
    }
  };

  /* Open chat */
  const openChat = async (targetUser) => {
    setSelectedUser(targetUser);

    try {
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

      if (currentUserId) {
        window.socket?.emit("join_private_chat", {
          userId: currentUserId,
          targetUserId: targetUser._id,
        });
      }
    } catch (err) {
      console.error("Failed to open chat", err);
    }
  };

  /* Send message */
  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !currentUserId) return;

    window.socket?.emit("send_private_message", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message,
    });

    setMessage("");
  };

  return (
    <div className="h-screen flex bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold">Contacts</h2>
            <p className="text-xs text-gray-400">
              Logged in as {currentUser?.username || "Unknown user"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-xs bg-blue-500 px-3 py-1 rounded"
            >
              + Add
            </button>

            <button
              onClick={handleLogout}
              className="text-xs bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search box */}
        {showSearch && (
          <div className="p-3 border-b border-gray-800">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username..."
              className="w-full p-2 bg-gray-800 rounded"
            />

            <button
              onClick={searchUsers}
              className="mt-2 w-full bg-green-500 p-2 rounded"
            >
              Search
            </button>

            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-gray-800 mt-2 p-2 rounded"
              >
                <span>{user.username}</span>

                <button
                  onClick={() => addContact(user._id)}
                  className="text-xs bg-blue-500 px-2 py-1 rounded"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className={`p-3 cursor-pointer border-b border-gray-800 hover:bg-gray-800 ${
                selectedUser?._id === user._id ? "bg-gray-800" : ""
              }`}
            >
              {user.username}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-800 bg-gray-900 font-semibold">
              {selectedUser.username}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-950">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs ${
                      msg.senderId === currentUserId
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

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
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
