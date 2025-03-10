import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import initializeSocket from "./socket/socket.js";
import http from "http";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { swaggerUi, specs } from "./config/swaggerConfig.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5020;

// app.use(cors({
//     origin: "*", // No need for array
//     credentials: true
// }));
//

// Initialize WebSocket
initializeSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to Database
connectDB();

// Define Routes
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use('/api/auth', AuthRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Start Server
server.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
