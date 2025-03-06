import express from "express";
import upload from "../config/upload.js";

const router = express.Router();
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Erorr in load fail !!" });
  }
});

export default router;
