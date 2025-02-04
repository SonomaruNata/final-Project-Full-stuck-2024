import Product from "../models/Product.mjs";
import Order from "../models/Order.mjs";
import Article from "../models/Article.mjs";

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};

// Fetch all orders
export const manageOrders = async (req, res) => {
  try {
    // Logic for managing orders
    res.status(200).json({ message: "Orders managed successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error managing orders", error: err.message });
  }
};

export const fetchOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.product");
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

// Update an order status
export const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};

// Fetch all articles
export const manageArticles = async (req, res) => {
  try {
    // Add your logic for managing articles here
    res.status(200).json({ message: "Articles managed successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error managing articles", error: err.message });
  }
};

export const fetchArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "username email");
    res.status(200).json(articles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching articles", error: err.message });
  }
};

// Update an article
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArticle)
      return res.status(404).json({ message: "Article not found" });
    res.status(200).json(updatedArticle);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating article", error: err.message });
  }
};

// Delete an article
export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle)
      return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting article", error: err.message });
  }
};
