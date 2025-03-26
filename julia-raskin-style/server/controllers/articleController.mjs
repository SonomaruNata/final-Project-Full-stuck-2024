import Article from "../models/Article.mjs";
import { createArticleSchema, updateArticleSchema } from "../middlewares/validationSchemas.mjs";

/**
 * 🖼️ Format image path to full URL
 */
const formatImageUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get("host")}/uploads/articles/${filename}` : null;

/**
 * ✅ Get All Articles (Public)
 */
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();

    console.log("✅ Fetched All Articles");
    res.status(200).json(articles);
  } catch (error) {
    console.error(`❌ Get Articles Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Get Single Article (Public)
 */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author", "name")
      .lean();

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(`✅ Fetched Article: ${article.title}`);
    res.status(200).json(article);
  } catch (error) {
    console.error(`❌ Get Article By ID Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🆕 Create Article (Admin Only)
 */
export const createArticle = async (req, res) => {
  const { error } = createArticleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const { title, content, category, tags, published } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    const article = new Article({
      title,
      content,
      imageUrl,
      author: req.user.id,
      category,
      tags,
      published,
    });

    const saved = await article.save();

    res.status(201).json({
      message: "Article created successfully",
      article: {
        ...saved.toObject(),
        imageUrl: formatImageUrl(req, saved.imageUrl),
      },
    });
  } catch (err) {
    console.error(`❌ Create Article Error: ${err.message}`);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✏️ Update Article (Admin Only)
 */
export const updateArticle = async (req, res) => {
  const { error } = updateArticleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation failed", errors: error.details });
  }

  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(`✅ Article Updated: ${updated.title}`);
    res.status(200).json({
      message: "Article updated successfully",
      article: {
        ...updated,
        imageUrl: formatImageUrl(req, updated.imageUrl),
      },
    });
  } catch (error) {
    console.error(`❌ Update Article Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ❌ Delete Article (Admin Only)
 */
export const deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(`✅ Article Deleted: ${deleted.title}`);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(`❌ Delete Article Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
