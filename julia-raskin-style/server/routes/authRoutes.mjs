import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs"; // ✅ Import Middleware

const router = express.Router();

// ✅ Auth Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, (req, res) => res.json(req.user)); // ✅ Protected Route

export default router;
