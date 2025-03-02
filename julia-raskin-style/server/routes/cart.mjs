import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.mjs";
import {
  protect,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";
import { cartSchema } from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/**
 * ✅ **Protected Cart Routes (User Authentication Required)**
 * - Users can **add items** to their cart
 * - Users can **view** their cart
 * - Users can **remove items** from the cart
 * - Users can **clear the cart**
 */
router.post("/", protect, validateRequest(cartSchema), addToCart); // 🛒 Add to cart
router.get("/", protect, getCart); // 📄 Get cart
router.delete("/:productId", protect, removeFromCart); // ❌ Remove item from cart
router.delete("/", protect, clearCart); // 🗑 Clear entire cart

export default router;
