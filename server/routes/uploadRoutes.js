import express from "express";
import upload from "../config/upload.js";

const router = express.Router();

/**
 * tags:
 *   name: Upload
 *   description: API for managing file uploads
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: URL of the uploaded image
 *       500:
 *         description: Error in file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */





router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Erorr in load fail !!" });
  }
});

export default router;
