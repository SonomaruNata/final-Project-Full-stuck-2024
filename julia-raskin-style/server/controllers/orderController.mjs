import Order from "../models/Order.mjs";
import Cart from "../models/Cart.mjs";
import { createOrderSchema, orderStatusSchema } from "../middlewares/validationSchemas.mjs";

/**
 * 🔎 Utility: Fetch Order By ID (Reusable)
 */
export const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("user", "name email")
    .populate("items.product", "name price imageUrl");
};

/**
 * 🛒 Place Order from Server-Side Cart
 */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: userId,
      items: cart.items,
      total,
      shippingAddress: req.body.shippingAddress || "Not Provided",
      paymentMethod: req.body.paymentMethod || "unpaid",
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    console.log(`✅ Order placed for user: ${userId}`);
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 📦 Process Order from Client-Sent Cart
 */
export const processDirectPayment = async (req, res) => {
  try {
    const { cart, shippingAddress, paymentMethod } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: req.user.id,
      items: cart,
      total,
      shippingAddress: shippingAddress || "Not Provided",
      paymentMethod: paymentMethod || "unpaid",
    });

    await newOrder.save();

    console.log(`✅ Direct order created by: ${req.user.email}`);
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Direct payment error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 👤 Fetch All Orders for Current User
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔑 Fetch All Orders (Admin View)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔄 Update Order Status (Admin Only)
 */
export const updateOrderStatus = async (req, res) => {
  const { error } = orderStatusSchema.validate(req.body);
  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();

    console.log(`✅ Order status updated to: ${req.body.status}`);
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Error updating order status:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
