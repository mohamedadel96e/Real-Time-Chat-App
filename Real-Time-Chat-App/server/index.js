import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 5020;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    credentials: true
}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

//import mongoose
const mongoose = require("mongoose");
//connect Data Base
mongoose
  .connect("mongodb://localhost:27017/Chatapp")
  .then(() => {
    console.log("DataBase connected");
  })
  .catch((err) => {
    console.log(err);
  });
//create schema
const Users_schema= new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
});
const Messages_schema= new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    text: { type: String, required: true },
    attachments: [{ type: String }], 
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    createdAt: { type: Date, default: Date.now }
});
const Groups_schema= new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], 
    createdAt: { type: Date, default: Date.now }
});
const Chats_schema= new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], 
    createdAt: { type: Date, default: Date.now }
});
//create Model
const Users=mongoose.model("Users",Users_schema);
const Messages=mongoose.model("Messages",Messages_schema);
const Groups=mongoose.model("Groups",Groups_schema);
const Chats=mongoose.model("Chats",Chats_schema);