import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
    getUserProfile,
    getUserById,
    updateUserProfile,
    searchUsers,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         profilePic:
 *           type: string
 *           description: The user's profile picture
 *         status:
 *           type: string
 *           enum: ["online", "offline"]
 *           description: The user's status
 *         friends:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user's friends
 *         createdAt:
 *           type: string
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           description: The date the user was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         username: "johndoe"
 *         email: "johndoe@example.com"
 *         password: "hashedpassword"
 *         profilePic: "http://example.com/profilepic.jpg"
 *         status: "online"
 *         friends: ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"]
 *         createdAt: "2021-06-22T19:44:15.000Z"
 *         updatedAt: "2021-06-22T19:44:15.000Z"
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profilePic:
 *                   type: string
 *                 status:
 *                   type: string
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profilePic:
 *                   type: string
 *                 status:
 *                   type: string
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by username or email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   profilePic:
 *                     type: string
 *                   status:
 *                     type: string
 *                   friends:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/me", verifyToken, getUserProfile);
router.get("/:id", verifyToken, getUserById);
router.put("/me", verifyToken, updateUserProfile);
router.get("/search", verifyToken, searchUsers);
router.delete("/me", verifyToken, deleteUser);

export default router;
