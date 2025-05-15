import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
export const upload = async (file) => {
    const result = await cloudinary.uploader.upload(file.path, {
        folder: "profile_pics",
    });
    fs.unlinkSync(file.path); // delete temp file
    return result;
};
/**
 * @desc Get current user profile
 * @route GET /api/users/me
 * @access Private
 */

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Get user by ID
 * @route GET /api/users/:id
 * @access Private
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/me
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, about, status } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (about) user.about = about;
        if (status) user.status = status;
        if (req.file) {
            
            const result = await upload(req.file);
            
            user.profilePic = result.url;
        }
        
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * @desc Search users by username or email
 * @route GET /api/users/search
 * @access Private
 */
export const searchUsers = async (req, res) => {
    try {
        const  email  = req.query.email;
        const currentUserId = req.user._id;

        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        // Search for users by email, excluding the current user
        const users = await User.find({
            email: { $regex: email, $options: 'i' },
            _id: { $ne: currentUserId }
        }).select('name email profilePic status');

        // Log the search results for debugging
        console.log('Search results:', users);

        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        // Send more detailed error information
        res.status(500).json({ 
            message: 'Error searching users',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * @desc Delete user
 * @route DELETE /api/users/me
 * @access Private
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
