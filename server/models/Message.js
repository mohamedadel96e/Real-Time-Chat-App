import mongoose from 'mongoose';


const Messages_schema= new mongoose.Schema(
  {
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  text: { type: String, required: true },
  attachments: [{ type: String }], 
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

export default mongoose.model("Message", Messages_schema);