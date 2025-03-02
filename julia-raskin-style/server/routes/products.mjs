import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct, // ✅ Renamed from "editProduct" to "updateProduct" for consistency
  deleteProduct,
} from "../controllers/productController.mjs";
import { protect, adminOnly } from "../middlewares/validateMiddleware.mjs";
import multer from "multer";
import path from "path";

const router = express.Router();

/**
 * ✅ **Image Upload Configuration**
 * - Uses `multer` to handle file uploads.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/images")); // ✅ Ensures correct absolute path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WEBP files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
});

/**
 * 🌍 **Public Routes (Accessible by Anyone)**
 */
router.get("/", getProducts); // ✅ Fetch All Products
router.get("/:id", getProductById); // ✅ Fetch Single Product

/**
 * 🔐 **Admin Routes (Only Admins Can Modify)**
 */
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct); // ✅ Renamed function
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
