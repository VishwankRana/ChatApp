import express from 'express';
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import initializeSocket from './socket';

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

initializeSocket(io);

app.listen(5000, () =>{
    console.log("Server is Listening on port 5000");
});