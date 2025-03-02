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

// ✅ Admin Routes (Only admins can create, update, delete)
router.post("/", protect, adminOnly, createArticle);
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

export default router;
