import Product from "../models/Product.mjs";
import Order from "../models/Order.mjs";
import Article from "../models/Article.mjs";

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
      console.error(`❌ Product not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`✅ Product Updated: ${updatedProduct.name}`);
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error(`❌ Error updating product: ${err.message}`);
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
      console.error(`❌ Product not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`✅ Product Deleted: ${deletedProduct.name}`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(`❌ Error deleting product: ${err.message}`);
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

    console.log("✅ Orders fetched successfully");
    res.status(200).json(orders);
  } catch (err) {
    console.error(`❌ Error fetching orders: ${err.message}`);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

/**
 * ✅ Fetch All Articles
 */
export const manageArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .select("-__v") // Exclude unnecessary fields
      .lean();

    console.log("✅ Articles fetched successfully");
    res.status(200).json(articles);
  } catch (err) {
    console.error(`❌ Error fetching articles: ${err.message}`);
    res.status(500).json({ message: "Error fetching articles", error: err.message });
  }
};
