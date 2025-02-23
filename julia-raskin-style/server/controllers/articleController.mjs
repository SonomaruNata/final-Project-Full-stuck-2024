// server/controllers/articleController.mjs
import Article from "../models/Article.mjs"; 

// ✅ Get All Articles
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Single Article
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "name");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Create Article (Protected)
export const createArticle = async (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      imageUrl: req.body.imageUrl,
      gallery: req.body.gallery || [],
    });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Article (Admin Only)
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Article (Admin Only)
export const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
