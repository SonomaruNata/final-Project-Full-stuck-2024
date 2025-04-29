import Product from "../models/Product.mjs";
import { productSchema, updateProductSchema } from "../middlewares/validationSchemas.mjs";
import { formatImageUrl } from "../utils/apiHelpers.mjs";

const FALLBACK_IMAGE = "default.jpg";

/**
 * ✅ Get All Products
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    if (!products.length) {
      return res.status(200).json([]); // empty array instead of 404
    }

    const formatted = products.map((product) => ({
      ...product,
      imageUrl: formatImageUrl(req, product.imageUrl || FALLBACK_IMAGE, "products"),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✅ Get Product By ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      ...product,
      imageUrl: formatImageUrl(req, product.imageUrl || FALLBACK_IMAGE, "products"),
    });
  } catch (err) {
    console.error(`❌ Error fetching product by ID: ${err.message}`);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✅ Create Product
 */
export const createProduct = async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const { name, description, price, category, stock } = req.body;
    const imageUrl = req.file?.filename || FALLBACK_IMAGE;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    const saved = await newProduct.save();

    res.status(201).json({
      message: "✅ Product created successfully",
      product: {
        ...saved.toObject(),
        imageUrl: formatImageUrl(req, saved.imageUrl, "products"),
      },
    });
  } catch (err) {
    console.error("❌ Error creating product:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✅ Update Product
 */
export const updateProduct = async (req, res) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = req.file.filename;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: {
        ...updated,
        imageUrl: formatImageUrl(req, updated.imageUrl, "products"),
      },
    });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✅ Delete Product
 */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
