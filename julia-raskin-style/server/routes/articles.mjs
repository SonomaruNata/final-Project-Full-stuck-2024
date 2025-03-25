import express from "express";
import multer from "multer";
import path from "path";

import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.mjs";

import {
  protect,
  adminOnly,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";

import {
  createArticleSchema,
  updateArticleSchema,
} from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/* -------------------------------------------
 🖼️ Multer Config for Article Image Upload
--------------------------------------------- */
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/uploads/articles"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("❌ Only JPEG, PNG, and WEBP files are allowed."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

/* -------------------------------------------
 🌍 Public Article Routes
--------------------------------------------- */
router.get("/", getArticles);           // ✅ Get all articles
router.get("/:id", getArticleById);     // ✅ Get single article by ID

/* -------------------------------------------
 🔐 Admin Routes (Protected + Validated)
--------------------------------------------- */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validateRequest(createArticleSchema),
  createArticle
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  validateRequest(updateArticleSchema),
  updateArticle
);

router.delete("/:id", protect, adminOnly, deleteArticle); // ✅ Delete article

export default router;
