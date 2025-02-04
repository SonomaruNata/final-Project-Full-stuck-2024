import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// ✅ User Routes (Require Authentication)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
