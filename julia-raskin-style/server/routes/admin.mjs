import express from "express";
import {
  updateProduct,
  deleteProduct,
  manageOrders,
  manageArticles,
} from "../controllers/adminController.mjs";
import { protect, adminOnly } from "../middlewares/authMiddleware.mjs"; 

const router = express.Router();

// ✅ Admin Dashboard - Protected Route
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard", user: req.user });
});

// ✅ Manage Products
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

// ✅ Manage Orders
router.get("/orders", protect, adminOnly, manageOrders);

// ✅ Manage Articles
router.get("/articles", protect, adminOnly, manageArticles);

export default router;
