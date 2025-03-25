import express from "express";
import {
  updateProduct,
  deleteProduct,
  manageOrders,
  manageUsers,
  manageArticles,
} from "../controllers/adminController.mjs";
import {
  updateUserRole,
  deleteUser
} from "../controllers/userController.mjs";
import { getProducts } from "../controllers/productController.mjs";

import {
  protect,
  adminOnly,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";
import {
  updateProductSchema,
  userRoleSchema
} from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/**
 * 🛠 Admin Dashboard
 */
router.get("/", protect, adminOnly, (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Dashboard", user: req.user });
});

/**
 * 🧪 Products
 */
router.get("/products", protect, adminOnly, getProducts);
router.put("/products/:id", protect, adminOnly, validateRequest(updateProductSchema), updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

/**
 * 📦 Orders
 */
router.get("/orders", protect, adminOnly, manageOrders);

/**
 * 👥 Users
 */
router.get("/users", protect, adminOnly, manageUsers);
router.put("/users/:id/role", protect, adminOnly, validateRequest(userRoleSchema), updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

/**
 * 📰 Articles
 */
router.get("/articles", protect, adminOnly, manageArticles);

export default router;
