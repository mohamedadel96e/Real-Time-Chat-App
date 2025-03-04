import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import AuthRoutes from './routes/AuthRoutes.js';
import initializeSocket from './socket/socket.js';
import socketIO from "socket.io";
import http from "http";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

const port = process.env.PORT || 5020;
app.use(cors({
    origin: [process.env.ORIGIN],
    credentials: true
}));


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/auth', AuthRoutes);
app.use('/api/messages', messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/groups", groupRoutes);
// const server = app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    initializeSocket(server);
});

