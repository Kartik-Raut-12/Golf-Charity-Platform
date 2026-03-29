import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { 
  getCharities, 
  selectCharity, 
  addCharity,
  updateCharity,
  deleteCharity 
} from "../controllers/charity.controller.js";

const router = express.Router();

router.get("/", getCharities);
router.put("/select", authMiddleware, selectCharity);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), addCharity);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCharity);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCharity);

export default router;