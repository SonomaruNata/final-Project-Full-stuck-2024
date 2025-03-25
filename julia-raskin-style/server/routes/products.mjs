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

/* -------------------------------------------
  🖼️ Multer Config for Image Upload
---------------------------------------------*/
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* -------------------------------------------
  🌍 Public Product Routes (No Auth Required)
---------------------------------------------*/
router.get("/", getProducts);           // ✅ Get all products
router.get("/:id", getProductById);     // ✅ Get single product by ID

/* -------------------------------------------
  🔐 Admin Routes (Require Auth + Role)
---------------------------------------------*/
router.post("/", protect, adminOnly, upload.single("image"), createProduct);       // ✅ Create product
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);     // ✅ Update product
router.delete("/:id", protect, adminOnly, deleteProduct);                          // ✅ Delete product

export default router;
