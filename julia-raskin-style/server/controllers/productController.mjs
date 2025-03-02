import Product from "../models/Product.mjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { productSchema } from "../middlewares/validationSchemas.mjs"; // ✅ Fixed import

/**
 * ✅ **Fetch All Products (Public)**
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    if (!products.length) {
      return res.status(404).json({ message: "No products available." });
    }

    // ✅ Format response with full image URLs
    const formattedProducts = products.map((product) => ({
      ...product,
      imageUrl: product.imageUrl
        ? `${req.protocol}://${req.get("host")}/images/${product.imageUrl}`
        : null,
    }));

    res.status(200).json(formattedProducts);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

/**
 * ✅ **Fetch Single Product by ID (Public)**
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      ...product,
      imageUrl: product.imageUrl
        ? `${req.protocol}://${req.get("host")}/images/${product.imageUrl}`
        : null,
    });
  } catch (err) {
    console.error(`❌ Error fetching product ID ${req.params.id}:`, err.message);
    res.status(500).json({ message: "Server error while fetching product", error: err.message });
  }
};

/**
 * ✅ **Create New Product (Admin Only)**
 */
export const createProduct = async (req, res) => {
  // ✅ Validate request data
  validateRequest(productSchema)(req, res, async () => {
    try {
      const { name, description, price, category, stock } = req.body;
      const imageUrl = req.file ? req.file.filename : "default.jpg";

      const newProduct = new Product({ name, description, price, category, imageUrl, stock });
      const savedProduct = await newProduct.save();

      res.status(201).json({ message: "Product created successfully", product: savedProduct });
    } catch (err) {
      console.error("❌ Error creating product:", err.message);
      res.status(500).json({ message: "Server error while creating product", error: err.message });
    }
  });
};

/**
 * ✅ **Update Existing Product (Admin Only)**
 */
export const updateProduct = async (req, res) => {
  // ✅ Validate request data
  validateRequest(productSchema)(req, res, async () => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.imageUrl = req.file.filename; // Only update image if a new one is uploaded
      }

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
      console.error("❌ Error updating product:", err.message);
      res.status(500).json({ message: "Error updating product", error: err.message });
    }
  });
};

/**
 * ✅ **Delete Product (Admin Only)**
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id).lean();

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
