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
    <div style={{ padding: 20 }}>
      <h2>Private Chat</h2>

      {!joined ? (
        <>
          <input
            placeholder="Enter user1 or user2"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={joinRoom}>Join</button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            {chat.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <input
            placeholder="Type message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
