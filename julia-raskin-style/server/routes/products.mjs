import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.mjs";
import { protect, adminOnly } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// ✅ Fetch all products
router.get("/", getProducts);

// ✅ Fetch a single product
router.get("/:id", getProductById);

// ✅ Create a product (Admin Only)
router.post("/", protect, adminOnly, createProduct);

// ✅ Update a product (Admin Only)
router.put("/:id", protect, adminOnly, updateProduct);

// ✅ Delete a product (Admin Only)
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
