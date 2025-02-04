import express from "express";
import Order from "../models/Order.mjs";
import { protect } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

/**
 * 📌 GET /api/orders - Fetch User Orders
 * @desc Retrieves all orders for the logged-in user
 * @access Private (User only)
 */
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product", "name price");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

export default router;
