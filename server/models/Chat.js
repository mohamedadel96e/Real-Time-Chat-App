import mongoose from 'mongoose';


const Chats_schema= new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], 
  },
  { timestamps: true }
);

export default mongoose.model("Chat", Chats_schema);