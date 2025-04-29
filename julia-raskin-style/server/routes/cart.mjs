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
 * 🛡️ Protect all cart routes
 * - Ensures only authenticated users access cart operations
 */
router.use(protect);

/**
 * ➕ Add item to cart
 * POST /api/cart
 */
router.post("/", validateRequest(cartSchema), addToCart);

/**
 * 📦 Get current user cart
 * GET /api/cart
 */
router.get("/", getCart);

/**
 * 🗑️ Remove specific item from cart
 * DELETE /api/cart/:productId
 */
router.delete("/:productId", removeFromCart);

/**
 * 🚮 Clear entire cart
 * DELETE /api/cart
 */
router.delete("/", clearCart);

export default router;
