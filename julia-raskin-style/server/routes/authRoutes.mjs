import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.mjs";
import {
  protect,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/**
 * ✅ **Public Routes (No Authentication Required)**
 */
router.post("/signup", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/logout", logoutUser);

/**
 * ✅ **Protected Routes (Requires Authentication)**
 * - `getUserProfile` allows users to fetch their own profile
 * - `updateUserProfile` allows users to update their own profile (with validation)
 */
router.get("/me", protect, getUserProfile);
router.put("/me", protect, validateRequest(updateUserSchema), updateUserProfile);

export default router;
