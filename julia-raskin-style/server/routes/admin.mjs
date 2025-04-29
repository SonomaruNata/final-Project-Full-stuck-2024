import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import {
  updateProduct,
  deleteProduct,
  manageOrders,
  manageUsers,
  manageArticles,
} from "../controllers/adminController.mjs";

import { createProduct, getProducts } from "../controllers/productController.mjs";
import { createArticle, updateArticle, deleteArticle } from "../controllers/articleController.mjs";
import { updateUserRole, deleteUser } from "../controllers/userController.mjs";

import {
  protect,
  adminOnly,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";

import {
  updateProductSchema,
  productSchema,
  userRoleSchema,
  createArticleSchema,
  updateArticleSchema,
} from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/* --------------------------------------------
  📁 Image Upload Config (Multer + Safe Directory)
--------------------------------------------- */

// Ensure directory exists or create it
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// 🔧 Reusable diskStorage for given folder
const configureStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(`public/${folder}`);
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  },
});

// ✅ Accepted Image Types
const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("❌ Only JPEG, PNG, and WEBP formats allowed"), false);
};

// Upload handlers
const productUpload = multer({
  storage: configureStorage("images/products"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const articleUpload = multer({
  storage: configureStorage("uploads/articles"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* --------------------------------------------
  🛠️ Admin Root
--------------------------------------------- */
router.get("/", protect, adminOnly, (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Dashboard", user: req.user });
});

/* --------------------------------------------
  🧪 Product Management
--------------------------------------------- */
router.get("/products", protect, adminOnly, getProducts);
router.post("/products", protect, adminOnly, productUpload.single("image"), validateRequest(productSchema), createProduct);
router.put("/products/:id", protect, adminOnly, productUpload.single("image"), validateRequest(updateProductSchema), updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

/* --------------------------------------------
  📦 Order Management
--------------------------------------------- */
router.get("/orders", protect, adminOnly, manageOrders);

/* --------------------------------------------
  👥 User Management
--------------------------------------------- */
router.get("/users", protect, adminOnly, manageUsers);
router.put("/users/:id/role", protect, adminOnly, validateRequest(userRoleSchema), updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

/* --------------------------------------------
  📰 Article Management
--------------------------------------------- */
router.get("/articles", protect, adminOnly, manageArticles);
router.post("/articles", protect, adminOnly, articleUpload.single("image"), validateRequest(createArticleSchema), createArticle);
router.put("/articles/:id", protect, adminOnly, articleUpload.single("image"), validateRequest(updateArticleSchema), updateArticle);
router.delete("/articles/:id", protect, adminOnly, deleteArticle);

export default router;
