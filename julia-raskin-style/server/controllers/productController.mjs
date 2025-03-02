import Product from "../models/Product.mjs";

/**
 * ✅ Fetch All Products (Public)
 * - Anyone can view all products.
 */
 export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    const updatedProducts = products.map((product) => ({
      ...product,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${product.imageUrl}`,
    }));

    console.log("✅ Fetched All Products:", updatedProducts);  // ✅ Debug Logging
    res.set("Cache-Control", "no-store");
    res.status(200).json(updatedProducts);
  } catch (err) {
    console.error(`❌ Error Fetching Products: ${err.message}`);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

/**
 * ✅ Fetch Single Product by ID (Public)
 * - Anyone can view a specific product by its ID.
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      console.error("❌ Product Not Found");
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(`✅ Fetched Product: ${product.name}`);
    res.set("Cache-Control", "no-store");
    res.status(200).json({
      ...product,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${product.imageUrl}`,
    });
  } catch (err) {
    console.error(`❌ Error Fetching Product: ${err.message}`);
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

/**
 * ✅ Create New Product (Admin Only)
 * - Only authenticated admin users can create products.
 */
export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? req.file.filename : "default.jpg"; // ✅ Store only filename

  try {
    const newProduct = new Product({ name, description, price, category, imageUrl, stock });
    const savedProduct = await newProduct.save();
    console.log(`✅ Product Created: ${savedProduct.name}`);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(`❌ Error Creating Product: ${err.message}`);
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

/**
 * ✅ Edit Product (Admin Only)
 * - Only authenticated admin users can update products.
 */
export const editProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const updatedData = {
      name,
      description,
      price,
      category,
      stock,
    };

    // ✅ Handle Image Update
    if (req.file) {
      updatedData.imageUrl = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      console.error("❌ Product Not Found for Update");
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`✅ Product Updated: ${updatedProduct.name}`);
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error(`❌ Error Updating Product: ${err.message}`);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

/**
 * ✅ Delete Product (Admin Only)
 * - Only authenticated admin users can delete products.
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      console.error("❌ Product Not Found for Deletion");
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(`✅ Product Deleted: ${deletedProduct.name}`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(`❌ Error Deleting Product: ${err.message}`);
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
