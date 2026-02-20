import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import initializeSocket from "./socket.js";
import connectDB from "./config.js";
import messageRoute from "./messageRoute.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

initializeSocket(io);

server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
