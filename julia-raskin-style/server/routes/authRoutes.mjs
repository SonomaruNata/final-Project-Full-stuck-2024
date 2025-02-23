import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs"; 

const router = express.Router();

// ✅ Auth Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" });
    }
  });
export default router;
