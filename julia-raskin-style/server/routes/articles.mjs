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
import { createArticleSchema, updateArticleSchema } from "../middlewares/validationSchemas.mjs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/uploads/articles")); // or wherever you store
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Public
router.get("/", getArticles);
router.get("/:id", getArticleById);

// ✅ Admin Only
router.post("/", protect, adminOnly, upload.single("image"), createArticle);
router.put("/:id", protect, adminOnly, upload.single("image"), updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

export default router;
