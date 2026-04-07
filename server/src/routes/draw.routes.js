import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import subscriptionMiddleware from "../middleware/subscription.middleware.js";
import {
  getDrawHistory,
  getWinners,
  resetCurrentDraw
} from "../controllers/draw.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/history", getDrawHistory);
router.get("/winners", getWinners);
router.delete("/reset-current", authMiddleware, adminMiddleware, resetCurrentDraw);

export default router;