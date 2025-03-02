import Article from "../models/Article.mjs";

/**
 * ✅ Get All Articles (Public)
 * - Anyone can view articles.
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
 * - Anyone can view a specific article by its ID.
 */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "name").lean();
    if (!article) {
      console.error("❌ Article Not Found");
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
 * - Only authenticated admin users can create articles.
 */
export const createArticle = async (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,  // ✅ Author is the logged-in user
      imageUrl: req.body.imageUrl,
      gallery: req.body.gallery || [],
    });

    const savedArticle = await newArticle.save();
    console.log(`✅ Article Created: ${savedArticle.title}`);
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error(`❌ Create Article Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Update Article (Protected + Admin Only)
 * - Only authenticated admin users can update articles.
 */
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedArticle) {
      console.error("❌ Article Not Found");
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
 * - Only authenticated admin users can delete articles.
 */
export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      console.error("❌ Article Not Found");
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(`✅ Article Deleted: ${deletedArticle.title}`);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(`❌ Delete Article Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
