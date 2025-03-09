import express from 'express';
import { signup, login, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import upload from "../config/upload.js"
const router = express.Router();

router.post("/signup",upload.single("profilePic"),signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, (req, res) => {
    res.json(req.user);
});

export default router;