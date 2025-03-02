import Product from "../models/Product.mjs";
import Order from "../models/Order.mjs";
import Article from "../models/Article.mjs";
import User from "../models/User.mjs";

/**
 * ✅ Update a Product (Admin Only)
 */
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

/**
 * ✅ Delete a Product (Admin Only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id).lean();

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

/**
 * ✅ Fetch All Orders (Admin Only)
 */
export const manageOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price imageUrl")
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

/**
 * ✅ Fetch All Users (Admin Only)
 */
export const manageUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("orders", "total status createdAt")
      .lean();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

/**
 * ✅ Fetch All Articles (Admin Only)
 */
export const manageArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .select("-__v")
      .lean();

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching articles", error: err.message });
  }
};
