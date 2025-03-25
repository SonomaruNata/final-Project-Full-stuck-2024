import Article from "../models/Article.mjs";

/**
 * ✅ Get All Articles (Public)
 */
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name").lean();
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
    const article = await Article.findById(req.params.id).populate("author", "name").lean();
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
 * ✅ Create Article (Protected + Admin Only)
 */
 export const createArticle = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.filename : null;
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
      imageUrl,
      author: req.user.id,
    });
    const saved = await article.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✅ Update Article (Protected + Admin Only)
 */
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(`✅ Article Updated: ${updatedArticle.title}`);
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error(`❌ Update Article Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Delete Article (Protected + Admin Only)
 */
export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(`✅ Article Deleted: ${deletedArticle.title}`);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(`❌ Delete Article Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
