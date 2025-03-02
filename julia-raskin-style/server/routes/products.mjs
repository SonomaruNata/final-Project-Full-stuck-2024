import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/productController.mjs";
import { protect, adminOnly } from "../middlewares/authMiddleware.mjs";
import multer from "multer";
import path from "path";

const router = express.Router();

/**
 * 🌐 Public Routes 
 * - Anyone can read product information.
 */
router.get("/", getProducts);        // ✅ Public Route
router.get("/:id", getProductById);  // ✅ Public Route


// ✅ Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/images")); // ✅ Save images in `public/images`
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // ✅ Unique filenames
  },
});
const upload = multer({ storage });

/**
 * 🔐 Admin Routes 
 * - Only admins can create, update, and delete products.
 */
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), editProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
