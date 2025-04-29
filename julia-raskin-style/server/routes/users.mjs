import express from "express";
import { protect, validateRequest } from "../middlewares/validateMiddleware.mjs";
import { updateUserSchema } from "../middlewares/validationSchemas.mjs";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.mjs";

const router = express.Router();

/* --------------------------------------------
   👤 User Profile Routes (Protected by JWT)
--------------------------------------------- */

/**
 * GET    /api/users/profile  → Get current user's profile
 * PUT    /api/users/profile  → Update profile (name, email, password, etc.)
 */
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validateRequest(updateUserSchema), updateUserProfile);

export default router;
