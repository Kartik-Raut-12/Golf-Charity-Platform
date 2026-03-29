import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadWinnerProof,
  getMyWinnings,
} from "../controllers/winner.controller.js";

const router = express.Router();

router.get("/my", authMiddleware, getMyWinnings);
router.post(
  "/upload-proof",
  authMiddleware,
  upload.single("proof"),
  uploadWinnerProof
);

export default router;