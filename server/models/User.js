import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    about: {type: String, default: ""},
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);