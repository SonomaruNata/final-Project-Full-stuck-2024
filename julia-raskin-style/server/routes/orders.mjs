// server/routes/orders.mjs
import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
} from "../controllers/orderController.mjs";
import { protect, adminOnly, userOnly } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

/** 
 * 👤 User Routes 
 * - Only logged-in users (non-admin) can access these routes.
 */

// ✅ Place Order (User Only)
router.post("/", protect, userOnly, placeOrder);

// ✅ Get User's Orders (User Only)
router.get("/my-orders", protect, userOnly, getUserOrders);

// ✅ Get Specific Order (User Only) - User can only view their own order
router.get("/my-orders/:id", protect, userOnly, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);

    // 🚫 Access Control: Only allow order owner to view it
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied: Not your order" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

/** 
 * 🔑 Admin Routes 
 * - Only admin users can access these routes.
 */

// 🔑 Get All Orders (Admin Only)
router.get("/", protect, adminOnly, getAllOrders);

// 🔑 Get Specific Order (Admin Only)
router.get("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 🔑 Update Order Status (Admin Only)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
