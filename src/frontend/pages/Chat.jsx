import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatPane from "../components/chat/ChatPane";
import ChatSidebar from "../components/chat/ChatSidebar";

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

      <ChatSidebar
        currentUsername={currentUsername}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        handleLogout={handleLogout}
        search={search}
        setSearch={setSearch}
        searchUsers={searchUsers}
        searchResults={searchResults}
        addContact={addContact}
        users={users}
        selectedUser={selectedUser}
        openChat={openChat}
        getInitial={getInitial}
      />

      <div className="flex flex-col flex-1 min-h-0 z-10">
        <ChatPane
          selectedUser={selectedUser}
          getInitial={getInitial}
          chat={chat}
          currentUserId={currentUserId}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
