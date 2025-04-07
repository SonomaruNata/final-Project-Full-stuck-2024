// ✅ apiHelpers.mjs

/**
 * 🖼️ Format image path to full absolute URL (safe, avoids double slashes)
 * @param {Request} req - Express request object
 * @param {string} filename - Raw filename or path
 * @param {string} type - Resource folder (e.g., 'articles', 'products')
 * @returns {string} Fully qualified image URL
 */
 export const formatImageUrl = (req, filename, type = "articles") => {
  const base = `${req.protocol}://${req.get("host")}/uploads/images/${type}`;
  if (!filename) return `${base}/default.jpg`;
  if (filename.startsWith("http")) return filename;

  const cleanPath = filename
    .replace(/^\/+(uploads\/images\/)?(articles|products)\//, "")
    .replace(/^\/+/, "");

  return `${base}/${cleanPath}`;
};
