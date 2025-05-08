const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
/**
 * ✅ Generate a full image URL for display
 * @param {string} path - Raw image path from the database
 * @param {string} fallback - Fallback image path (default = product placeholder)
 * @returns {string} Fully qualified image URL
 */
 export const getFullImageUrl = (path, fallback = "/uploads/images/products/default.jpg") => {
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // If path is already an absolute URL (e.g., from Cloudinary or CDN)
  if (path && path.startsWith("http")) return path;

  // Determine folder type (products or articles) from fallback
  const folder = fallback.includes("articles") ? "articles" : "products";

  // Remove any duplicated path pieces
  const cleanFilename = path
    ? path
        .replace(/^\/+uploads\/images\/(products|articles)\//, "")
        .replace(/^\/+/, "")
    : fallback.split("/").pop();

  return `${baseURL}/uploads/images/${folder}/${cleanFilename}`;
};
