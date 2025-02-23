// controllers/cartController.mjs
import Cart from "../models/Cart.mjs";
import Product from "../models/Product.mjs";

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// ✅ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// ✅ Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// ✅ Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove cart item" });
  }
};

// ✅ Checkout Cart
export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Clear the cart after checkout
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    // Respond with success
    res.status(200).json({ message: "Checkout successful!", total });
  } catch (error) {
    console.error("❌ Error during checkout:", error);
    res.status(500).json({ message: "Checkout failed. Please try again." });
  }
};

// ✅ Single Export Statement
export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
};
