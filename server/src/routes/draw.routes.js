import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import subscriptionMiddleware from "../middleware/subscription.middleware.js";
import {
  getDrawHistory,
  getWinners,
} from "../controllers/draw.controller.js";
const router = express.Router();

router.get("/history", authMiddleware, subscriptionMiddleware, getDrawHistory);
router.get("/winners", authMiddleware, subscriptionMiddleware, getWinners);

export default router;