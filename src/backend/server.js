import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config.js";
import messageRoutes from "./routes/messageRoutes.js";
import Chat from "./models/Chat.js";

connectDB();

const app = express();
app.use(express.json());
app.use("/api", messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    if (!username) return;
    socket.username = username;
    io.emit("system", `${username} joined the chat`);
  });

  socket.on("message", async (text) => {
    if (!text?.trim()) return;

    try {
      const msg = await Chat.create({
        sender: socket.username,
        message: text
      });

      io.emit("message", msg);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("system", `${socket.username} left`);
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
