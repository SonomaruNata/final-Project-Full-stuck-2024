import express from "express";
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
} from "../middlewares/validationSchemas.mjs"; // ✅ Use a single validation file

const router = express.Router();

/**
 * ✅ **Public Routes (Anyone can read articles)**
 */
router.get("/", getArticles);
router.get("/:id", getArticleById);

/**
 * ✅ **Admin Routes (Only admins can create, update, delete articles)**
 * - `createArticle` requires `createArticleSchema` validation
 * - `updateArticle` requires `updateArticleSchema` validation
 */
router.post("/", protect, adminOnly, validateRequest(createArticleSchema), createArticle);
router.put("/:id", protect, adminOnly, validateRequest(updateArticleSchema), updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

export default router;
