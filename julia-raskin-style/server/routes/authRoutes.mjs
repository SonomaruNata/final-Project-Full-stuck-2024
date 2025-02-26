import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile
} from "../controllers/authController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// ✅ Public Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ Protected Routes
router.get("/me", protect, getUserProfile);

export default router;
