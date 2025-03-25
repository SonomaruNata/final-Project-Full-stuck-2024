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
} from "../middlewares/validateMiddleware.mjs";

const router = express.Router();

/* ------------------------------------------
 👤 User Order Routes (Authentication Required)
---------------------------------------------*/

/**
 * POST /api/orders
 * @desc   Place a new order
 * @access User
 */
router.post("/", protect, userOnly, placeOrder);

/**
 * GET /api/orders/my-orders
 * @desc   Get all orders for the logged-in user
 * @access User
 */
router.get("/my-orders", protect, userOnly, getUserOrders);

/**
 * GET /api/orders/my-orders/:id
 * @desc   Get specific order belonging to the user
 * @access User
 */
router.get("/my-orders/:id", protect, userOnly, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order || String(order.user) !== req.user.id) {
      return res.status(403).json({ message: "Access denied: This is not your order." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Failed to fetch user order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* ------------------------------------------
 🔑 Admin Order Routes
---------------------------------------------*/

/**
 * GET /api/orders
 * @desc   Get all orders in the system
 * @access Admin
 */
router.get("/", protect, adminOnly, getAllOrders);

/**
 * GET /api/orders/:id
 * @desc   Get specific order by ID
 * @access Admin
 */
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Admin order fetch error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status
 * @desc   Update order status (Processing, Shipped, etc.)
 * @access Admin
 */
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
