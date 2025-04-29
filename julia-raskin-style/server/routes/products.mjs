import express from "express";
import path from "path";
import multer from "multer";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.mjs";
import {
  protect,
  adminOnly,
} from "../middlewares/validateMiddleware.mjs";

const router = express.Router();

/* ----------------------------------------
   🖼️ Multer Config for Product Image Upload
----------------------------------------- */

// ✅ Image storage destination
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve("public/uploads/images/products");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    cb(null, uniqueName);
  },
});

// ✅ File type filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("❌ Invalid file type. Only JPEG, PNG, or WEBP allowed."),
      false
    );
  }
  cb(null, true);
};

// ✅ Upload middleware
const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

/* ----------------------------------------
   🌍 Public Product Routes
----------------------------------------- */

// 📦 Fetch all products
router.get("/", getProducts);

// 🔍 Fetch product by ID
router.get("/:id", getProductById);

/* ----------------------------------------
   🔐 Admin Product Routes (Protected)
----------------------------------------- */

// ➕ Create new product
router.post("/", protect, adminOnly, upload.single("image"), createProduct);

// ✏️ Update product
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);

// ❌ Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
