import User from "../models/User.mjs";
import Product from "../models/Product.mjs";

/**
 * 📌 Fetch User Cart
 * @route GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

/**
 * 📌 Add Item to Cart
 * @route POST /api/cart
 */
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding item to cart", error: err.message });
  }
};

/**
 * 📌 Update Cart Item Quantity
 * @route PUT /api/cart/:productId
 */
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find((item) => item.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Product not found in cart" });

    item.quantity = quantity;
    await user.save();

    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
};

/**
 * 📌 Remove Item from Cart
 * @route DELETE /api/cart/:productId
 */
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
    await user.save();

    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart", error: err.message });
  }
};

/**
 * 📌 Checkout (Clear Cart)
 * @route POST /api/cart/checkout
 */
export const checkoutCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Checkout successful! Cart is now empty." });
  } catch (err) {
    res.status(500).json({ message: "Error during checkout", error: err.message });
  }
};
