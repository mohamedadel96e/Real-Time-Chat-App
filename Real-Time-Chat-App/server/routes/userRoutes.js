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

router.get("/me", verifyToken, getUserProfile);
router.get("/:id", verifyToken, getUserById);
router.put("/me", verifyToken, updateUserProfile);
router.get("/search", verifyToken, searchUsers);
router.delete("/me", verifyToken, deleteUser);

export default router;
