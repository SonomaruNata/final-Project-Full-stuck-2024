import Order from "../models/Order.mjs";
import Cart from "../models/Cart.mjs";

// 🛒 Place Order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    let total = 0;
    for (let item of cart.items) {
      total += item.product.price * item.quantity;
    }

    const newOrder = new Order({
      user: userId,
      items: cart.items,
      total,
    });

    await newOrder.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 👤 Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔑 Admin: Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user items.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔄 Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
