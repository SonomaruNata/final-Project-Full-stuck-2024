// server/routes/articles.mjs
import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.mjs";
import { protect, adminOnly } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// ✅ Public Routes (Anyone can read articles)
router.get("/", getArticles);
router.get("/:id", getArticleById);

// ✅ Protected Routes (Only logged-in users can create)
router.post("/", protect, createArticle);

// ✅ Admin Routes (Only admins can update/delete)
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

export default router;
