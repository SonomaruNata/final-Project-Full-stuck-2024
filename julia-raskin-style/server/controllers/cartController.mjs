import Cart from "../models/Cart.mjs";
import Product from "../models/Product.mjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { cartSchema } from "../middlewares/validationSchemas.mjs";

/**
 * 🔁 Utility: Recalculate Total
 */
const recalculateTotal = (items) => {
  return items.reduce(
    (acc, item) => acc + item.quantity * (item.product?.price || 0),
    0
  );
};

/**
 * ✅ Add Product to Cart
 */
export const addToCart = async (req, res) => {
  try {
    validateRequest(cartSchema)(req, res, async () => {
      const { productId, quantity } = req.body;

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      let cart = await Cart.findOne({ user: req.user.id });

      if (!cart) {
        cart = new Cart({ user: req.user.id, items: [] });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity,
          imageUrl: product.imageUrl,
        });
      }

      cart.total = recalculateTotal(
        await Cart.populate(cart, { path: "items.product" }).then((pop) => pop.items)
      );

      await cart.save();
      res.status(200).json({ message: "🛒 Product added to cart", cart });
    });
  } catch (err) {
    console.error("❌ Add to Cart Error:", err.message);
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

/**
 * ✅ Get User Cart
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name price imageUrl")
      .lean();

    if (!cart) return res.status(200).json({ items: [], total: 0 });

    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Get Cart Error:", err.message);
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

/**
 * ✅ Remove Product from Cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const indexBefore = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    if (cart.items.length === indexBefore) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.total = recalculateTotal(
      await Cart.populate(cart, { path: "items.product" }).then((pop) => pop.items)
    );

    await cart.save();
    res.status(200).json({ message: "🗑️ Product removed from cart", cart });
  } catch (err) {
    console.error("❌ Remove from Cart Error:", err.message);
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
};

/**
 * ✅ Clear Entire Cart
 */
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "🧹 Cart cleared successfully" });
  } catch (err) {
    console.error("❌ Clear Cart Error:", err.message);
    res.status(500).json({ message: "Error clearing cart", error: err.message });
  }
};
