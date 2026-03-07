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
  const currentUsername = currentUser?.username || "Unknown user";

  const getInitial = (name) => (name?.trim()?.[0] || "?").toUpperCase();

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
          createdAt: data.createdAt,
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
            createdAt: msg.createdAt,
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
    <div
      className="h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 relative overflow-hidden"
      style={{ fontFamily: '"Manrope", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900/70 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-700/60 flex flex-col z-10">
        <div className="px-4 py-4 flex justify-between items-center border-b border-slate-700/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 font-bold grid place-items-center">
              {getInitial(currentUsername)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight">Contacts</h2>
              <p className="text-xs text-slate-300/80 truncate">
                Logged in as {currentUsername}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg font-semibold transition"
            >
              + Add
            </button>

            <button
              onClick={handleLogout}
              className="text-xs bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search box */}
        {showSearch && (
          <div className="p-3 border-b border-slate-700/60 bg-slate-900/60">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username..."
              className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-lg outline-none focus:border-cyan-400"
            />

            <button
              onClick={searchUsers}
              className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold p-2 rounded-lg transition"
            >
              Search
            </button>

            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-slate-800/80 mt-2 p-2.5 rounded-lg border border-slate-700/70"
              >
                <span>{user.username}</span>

                <button
                  onClick={() => addContact(user._id)}
                  className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-2.5 py-1 rounded-md transition"
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
              className={`p-3 cursor-pointer border-b border-slate-800/80 hover:bg-slate-800/80 transition ${
                selectedUser?._id === user._id
                  ? "bg-slate-800/90 border-l-2 border-l-cyan-400"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-700 grid place-items-center text-sm font-semibold">
                  {getInitial(user.username)}
                </div>
                <div className="font-medium">{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-h-0 z-10">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-slate-700/60 bg-slate-900/70 backdrop-blur-xl font-semibold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-700 grid place-items-center">
                {getInitial(selectedUser.username)}
              </div>
              <div>
                <div className="font-semibold tracking-tight">
                  {selectedUser.username}
                </div>
                <div className="text-xs text-slate-300/80">Private chat</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/70">
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
                    className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm ${
                      msg.senderId === currentUserId
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                        : "bg-slate-800 border border-slate-700"
                    }`}
                  >
                    {msg.message}
                    {msg.createdAt && (
                      <div className="text-[10px] mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-700/60 bg-slate-900/70 backdrop-blur-xl flex gap-3">
              <input
                className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 px-5 py-2 rounded-xl font-semibold transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-200">
                Start a conversation
              </div>
              <div className="text-sm mt-1">
                Select a contact from the left panel.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
