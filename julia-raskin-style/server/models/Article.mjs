import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    gallery: [{ type: String }], // ✅ Array for additional images
    datePublished: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
