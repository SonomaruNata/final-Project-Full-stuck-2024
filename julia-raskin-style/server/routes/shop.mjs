import express from "express";
import Product from "../models/Product.mjs";
import User from "../models/User.mjs";

const router = express.Router();

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
});

// Get a product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
  }
});

// Add a product to cart
router.post("/cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!user.cart) user.cart = [];
    user.cart.push({ product: productId, quantity });
    await user.save();

    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
});

// Get cart items
router.get("/cart/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "cart.product"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
});

// Remove a product from cart
router.delete("/cart/:userId/:productId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();

    res.json({ message: "Product removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({
      message: "Error removing product from cart",
      error: err.message,
    });
  }
});

export default router;
