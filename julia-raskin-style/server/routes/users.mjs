import express from "express";
import { protect } from "../middlewares/authMiddleware.mjs";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.mjs";

const router = express.Router();

// ✅ Get and Update User Profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
