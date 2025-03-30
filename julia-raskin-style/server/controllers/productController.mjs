import Product from "../models/Product.mjs";
import { productSchema, updateProductSchema } from "../middlewares/validationSchemas.mjs";

/**
 * 🔗 Format image path to absolute URL
 */
const formatImageUrl = (req, filename) => {
  const basePath = `${req.protocol}://${req.get("host")}/images/products`;
  return filename ? `${basePath}/${filename}` : `${basePath}/default.jpg`;
};

/**
 * 🌍 Fetch All Products (Public)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    if (!products.length) {
      return res.status(404).json({ message: "No products available." });
    }

    const formatted = products.map((product) => ({
      ...product,
      imageUrl: formatImageUrl(req, product.imageUrl),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

/**
 * 🔎 Fetch Single Product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      ...product,
      imageUrl: formatImageUrl(req, product.imageUrl),
    });
  } catch (err) {
    console.error(`❌ Error fetching product ID ${req.params.id}:`, err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * 🆕 Create Product (Admin Only)
 */
export const createProduct = async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const { name, description, price, category, stock } = req.body;
    const imageUrl = req.file ? req.file.filename : "default.jpg";

    const newProduct = new Product({ name, description, price, category, imageUrl, stock });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: {
        ...savedProduct.toObject(),
        imageUrl: formatImageUrl(req, savedProduct.imageUrl),
      },
    });
  } catch (err) {
    console.error("❌ Product creation error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ✏️ Update Product
 */
export const updateProduct = async (req, res) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = req.file.filename;

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        ...updated,
        imageUrl: formatImageUrl(req, updated.imageUrl),
      },
    });
  } catch (err) {
    console.error("❌ Product update error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ❌ Delete Product
 */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Product deletion error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
