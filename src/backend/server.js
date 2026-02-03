import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*"}
})

io.on("connection", (socket) =>{
    console.log("User Connected:", socket.id);
    
    socket.on("join", (username) =>{
        socket.username = username;
        io.emit("system", `${username} joined the chat`);
    });

    socket.on("message", (msg) =>{
        io.emit("message", {
            user: socket.username,
            text: msg
        });
    });

    socket.on("disconnect", () =>{
        if(socket.username){
            io.emit("system", `${socket.username} left`)
        }
    });
});

server.listen(5000, () =>{
    console.log("Server running on port 5000");
})