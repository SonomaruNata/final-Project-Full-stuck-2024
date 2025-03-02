import Order from "../models/Order.mjs";
import Cart from "../models/Cart.mjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs"; // ✅ Correct path
import { createOrderSchema, orderStatusSchema } from "../middlewares/validationSchemas.mjs"; // ✅ Ensure validationSchemas.mjs exists

/**
 * ✅ **Get Order by ID (Reusable)**
 */
export const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("user", "name email")
    .populate("items.product", "name price imageUrl");
};

/**
 * 🛒 **Place Order**
 * - User must be authenticated
 * - Requires a valid cart with items
 */
export const placeOrder = async (req, res) => {
  try {
    // ✅ Validate request using Joi schema
    validateRequest(createOrderSchema)(req, res, async () => {
      const userId = req.user.id;
      const cart = await Cart.findOne({ user: userId }).populate("items.product");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Your cart is empty" });
      }

      // ✅ Calculate total cost
      const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      // ✅ Create new order
      const newOrder = new Order({
        user: userId,
        items: cart.items,
        total,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
      });

      await newOrder.save();

      // ✅ Clear user's cart
      cart.items = [];
      await cart.save();

      console.log(`✅ Order Placed Successfully for User: ${userId}`);
      res.status(201).json({ message: "Order placed successfully", order: newOrder });
    });
  } catch (error) {
    console.error("❌ Order Placement Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 👤 **Get User Orders**
 * - Users can view their own orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    console.log(`✅ Retrieved Orders for User: ${req.user.id}`);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Get User Orders Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔑 **Admin: Get All Orders**
 * - Admins can view all orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    console.log("✅ Retrieved All Orders (Admin)");
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Get All Orders Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔄 **Update Order Status (Admin Only)**
 * - Admins can update order status (pending, shipped, delivered, canceled)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    // ✅ Validate request using Joi schema
    validateRequest(orderStatusSchema)(req, res, async () => {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = status;
      await order.save();

      console.log(`✅ Order Status Updated to "${status}" for Order ID: ${order._id}`);
      res.status(200).json({ message: "Order status updated", order });
    });
  } catch (error) {
    console.error("❌ Update Order Status Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
