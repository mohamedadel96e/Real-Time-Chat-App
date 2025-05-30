import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePic = req.file
      ? req.file.path
      : "https://res.cloudinary.com/dnnyocc5s/image/upload/v1747134558/profile-user-svgrepo-com_lbpuox.jpg";

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Update user status to online
    user.status = "online";
    await user.save();
    // Create Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, { status: "offline" }).catch(() => {});
  res.clearCookie("token");
  res.json({ message: "User logged out successfully" });
};

export { signup, login, logout };
