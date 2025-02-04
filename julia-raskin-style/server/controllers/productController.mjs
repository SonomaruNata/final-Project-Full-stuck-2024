import Product from "../models/Product.mjs";

// ✅ Fetch all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const updatedProducts = products.map((product) => ({
      ...product._doc,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${product.imageUrl}`, // ✅ Correct image URL
    }));

    res.status(200).json(updatedProducts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// ✅ Fetch single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      ...product._doc,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${product.imageUrl}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// ✅ Create Product with Image Upload
export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? req.file.filename : "default.jpg"; // ✅ Store only filename

  try {
    const newProduct = new Product({ name, description, price, category, imageUrl, stock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
