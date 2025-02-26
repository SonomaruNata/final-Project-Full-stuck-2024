// server/controllers/cartController.mjs
import Cart from "../models/Cart.mjs";
import Product from "../models/Product.mjs";
import Order from "../models/Order.mjs";

/**
 * ✅ Get Cart Items
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Your cart is empty", items: [] });
    }
    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error("❌ Error getting cart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Add to Cart
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if stock is sufficient
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product is already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Checkout Cart Function
 */
export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Check stock and calculate total
    let total = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }

      total += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      items: cart.items,
      total,
    });

    await newOrder.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Checkout successful", order: newOrder });
  } catch (error) {
    console.error("❌ Error during checkout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

