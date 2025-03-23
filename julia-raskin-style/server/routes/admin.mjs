import express from "express";
import {
  updateProduct,
  deleteProduct,
  manageOrders,
  manageUsers,
  manageArticles,
} from "../controllers/adminController.mjs";
import {
  protect,
  adminOnly,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";
import { updateProductSchema } from "../middlewares/validationSchemas.mjs"; // ✅ Fixed Import

const router = express.Router();

// ✅ Admin Dashboard Route
router.get("/", protect, adminOnly, (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Dashboard", user: req.user });
});

// ✅ Manage Products
router.put("/products/:id", protect, adminOnly, validateRequest(updateProductSchema), updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

// ✅ Manage Orders
router.get("/orders", protect, adminOnly, manageOrders);

// ✅ Manage Users
router.get("/users", protect, adminOnly, manageUsers);

// ✅ Manage Articles
router.get("/articles", protect, adminOnly, manageArticles);

export default router;
