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

import {
  createProduct,
  getProducts,
} from "../controllers/productController.mjs";

import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.mjs";

import {
  updateUserRole,
  deleteUser,
} from "../controllers/userController.mjs";

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

/* -----------------------------------
📁 Multer Storage Setup w/ fs Checks
----------------------------------- */

// 🔄 Ensure directories exist or create them
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ✅ Product Image Storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve("public/images/products");
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

// ✅ Article Image Storage
const articleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve("public/uploads/articles");
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

// 🔍 Shared File Filter
const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only JPG, PNG, WEBP allowed"), false);
};

const productUpload = multer({ storage: productStorage, fileFilter: imageFilter });
const articleUpload = multer({ storage: articleStorage, fileFilter: imageFilter });

/* -----------------------------------
🛠️ Admin Root
----------------------------------- */
router.get("/", protect, adminOnly, (req, res) => {
  res.status(200).json({ message: "Welcome to Admin Dashboard", user: req.user });
});

/* -----------------------------------
🧪 Products
----------------------------------- */
router.get("/products", protect, adminOnly, getProducts);
router.post(
  "/products",
  protect,
  adminOnly,
  productUpload.single("image"),
  validateRequest(productSchema),
  createProduct
);
router.put(
  "/products/:id",
  protect,
  adminOnly,
  productUpload.single("image"),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

/* -----------------------------------
📦 Orders
----------------------------------- */
router.get("/orders", protect, adminOnly, manageOrders);

/* -----------------------------------
👥 Users
----------------------------------- */
router.get("/users", protect, adminOnly, manageUsers);
router.put("/users/:id/role", protect, adminOnly, validateRequest(userRoleSchema), updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

/* -----------------------------------
📰 Articles (Admin)
----------------------------------- */
router.get("/articles", protect, adminOnly, manageArticles);
router.post(
  "/articles",
  protect,
  adminOnly,
  articleUpload.single("image"),
  validateRequest(createArticleSchema),
  createArticle
);
router.put(
  "/articles/:id",
  protect,
  adminOnly,
  articleUpload.single("image"),
  validateRequest(updateArticleSchema),
  updateArticle
);
router.delete("/articles/:id", protect, adminOnly, deleteArticle);

export default router;
