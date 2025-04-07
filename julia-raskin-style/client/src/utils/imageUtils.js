const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * ✅ Generate full image URL (safe against double slashes)
 * @param {string} path - Raw image path from DB
 * @param {string} fallback - Relative fallback path (default = products)
 * @returns {string} - Full image URL
 */
export const getFullImageUrl = (path, fallback = "/uploads/images/products/default.jpg") => {
  if (!path) return `${API_URL}${fallback}`;

  // Avoid double path like /uploads/images/products//uploads/images/products/image.jpg
  const cleaned = path.replace(/^\/+uploads\/images\/(products|articles)\//, "").replace(/^\/+/, "");
  const folderMatch = fallback.includes("articles") ? "articles" : "products";

  return path.startsWith("http")
    ? path
    : `${API_URL}/uploads/images/${folderMatch}/${cleaned}`;
};
