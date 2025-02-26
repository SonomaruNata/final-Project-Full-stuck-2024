import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.mjs";
import { protect, admin, userOnly } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

/**
 * ✅ Place Order (User Only)
 * This route allows authenticated users (excluding admin) to place an order.
 */
router.post("/", protect, userOnly, placeOrder);

/**
 * ✅ Get User's Orders (User Only)
 * Retrieves all orders for the logged-in user.
 */
router.get("/my-orders", protect, userOnly, getUserOrders);

/**
 * 🔑 Admin: Get All Orders
 * Allows admin users to view all orders in the system.
 */
router.get("/", protect, admin, getAllOrders);

/**
 * 🔄 Update Order Status (Admin Only)
 * Admins can update the status of an order (Processing, Shipped, Delivered).
 */
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;
