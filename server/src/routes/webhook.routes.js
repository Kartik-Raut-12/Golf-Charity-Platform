import express from "express";
import { handleStripeWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// The handleStripeWebhook middleware expects the raw body
router.post("/", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
