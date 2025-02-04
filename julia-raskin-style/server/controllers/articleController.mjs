import Article from "../models/Article.mjs";

// ✅ Get All Articles (Including Gallery)
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name email");
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching articles", error: err.message });
  }
};

// ✅ Get a Single Article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "name email");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Error fetching article", error: err.message });
  }
};

// ✅ Upload New Article with Gallery
export const createArticle = async (req, res) => {
  const { title, content, author, imageUrl, gallery } = req.body;
  try {
    const newArticle = new Article({ title, content, author, imageUrl, gallery });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(500).json({ message: "Error creating article", error: err.message });
  }
};

// ✅ Update an Existing Article (Allowing Gallery Updates)
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArticle) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(updatedArticle);
  } catch (err) {
    res.status(500).json({ message: "Error updating article", error: err.message });
  }
};

// ✅ Delete an Article
export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting article", error: err.message });
  }
};
