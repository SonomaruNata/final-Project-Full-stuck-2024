import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.mjs";
import {
  protect,
  adminOnly,
  userOnly,
} from "../middlewares/validateMiddleware.mjs"; // ✅ Fixed incorrect import path

const router = express.Router();

/**
 * 👤 **User Routes**
 */

// ✅ **Place Order (User Only)**
router.post("/", protect, userOnly, placeOrder);

// ✅ **Get User's Orders (User Only)**
router.get("/my-orders", protect, userOnly, getUserOrders);

// ✅ **Get Specific Order (User Only)**
router.get("/my-orders/:id", protect, userOnly, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    // 🚫 **Access Control: Only allow order owner to view it**
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied: Not your order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔑 **Admin Routes**
 */

// 🔑 **Get All Orders (Admin Only)**
router.get("/", protect, adminOnly, getAllOrders);

// 🔑 **Get Specific Order (Admin Only)**
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔑 **Update Order Status (Admin Only)**
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
