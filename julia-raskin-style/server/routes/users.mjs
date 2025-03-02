import express from "express";
import { protect } from "../middlewares/validateMiddleware.mjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { updateUserSchema } from "../middlewares/validationSchemas.mjs";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.mjs";

const router = express.Router();

/**
 * ✅ **User Profile Routes**
 * - `GET /profile` → Fetch user profile (protected)
 * - `PUT /profile` → Update user profile (protected, validated)
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validateRequest(updateUserSchema), updateUserProfile); // ✅ Added validation

export default router;
