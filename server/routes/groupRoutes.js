import express from "express";
import { createGroup, addMember, removeMember, deleteGroup } from "../controllers/groupController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createGroup);
router.put("/:groupId/add-member", verifyToken, addMember);
router.put("/:groupId/remove-member", verifyToken, removeMember);
router.delete("/:groupId", verifyToken, deleteGroup);

export default router;
