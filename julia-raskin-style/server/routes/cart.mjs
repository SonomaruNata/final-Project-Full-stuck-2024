import express from "express";
import { protect } from "../middlewares/authMiddleware.mjs";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
} from "../controllers/cartController.mjs";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);
router.post("/checkout", protect, checkoutCart);

export default router;
