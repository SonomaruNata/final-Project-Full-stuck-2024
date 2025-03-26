import Product from "../models/Product.mjs";
import Order from "../models/Order.mjs";
import Article from "../models/Article.mjs";
import User from "../models/User.mjs";
import { updateProductSchema } from "../middlewares/validationSchemas.mjs";

/**
 * ✅ Format image URL
 */
const formatImageUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get("host")}/images/products/${filename}` : null;

/**
 * 🧪 Update Product (Admin Only)
 */
export const updateProduct = async (req, res) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        ...updatedProduct,
        imageUrl: formatImageUrl(req, updatedProduct.imageUrl),
      },
    });
  } catch (err) {
    console.error("❌ Update Product Error:", err.message);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

/**
 * ❌ Delete Product (Admin Only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Product Error:", err.message);
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

/**
 * 📦 Get All Orders (Admin)
 */
export const manageOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err.message);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

/**
 * 👥 Get All Users (Admin)
 */
export const manageUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Fetch Users Error:", err.message);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

/**
 * 📰 Get All Articles (Admin)
 */
export const manageArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .select("-__v")
      .lean();

    res.status(200).json(articles);
  } catch (err) {
    console.error("❌ Fetch Articles Error:", err.message);
    res.status(500).json({ message: "Error fetching articles", error: err.message });
  }
};
