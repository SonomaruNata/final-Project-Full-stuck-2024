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

import { protect, adminOnly } from "../middlewares/validateMiddleware.mjs";

const router = express.Router();

// 🖼️ Multer Config
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/uploads/images/products"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
    cb(null, uniqueSuffix);
  },
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("❌ Invalid file type. Only JPEG, PNG, WEBP allowed."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 🌍 Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔐 Admin Routes
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
