import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import mongoose from "mongoose";
import moment from "moment";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";

import { authenticateToken, protect, adminOnly } from "./middlewares/validateMiddleware.mjs";
import { seedDatabase } from "./seed.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// 🧩 Basic Middleware (before DB)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Accept, Authorization",
}));

// 📂 Upload folder setup
const publicUploadsPath = path.join(__dirname, "public/uploads");
const fallbackBase64 = "iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAACZcO2pAAAAFElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAwF+lAAEE1R5fAAAAAElFTkSuQmCC";

const ensureUploadDir = (subPath) => {
  const fullPath = path.join(publicUploadsPath, subPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(chalk.yellow(`📁 Created: /uploads/${subPath}`));
  }
  return fullPath;
};

const createFallbackImage = (folder, name) => {
  const filePath = path.join(publicUploadsPath, "images", folder, name);
  if (!fs.existsSync(filePath)) {
    const buffer = Buffer.from(fallbackBase64, "base64");
    fs.writeFileSync(filePath, buffer);
    console.log(chalk.green(`🧩 Fallback image created: ${filePath}`));
  }
};

["products", "articles"].forEach((folder) => {
  ensureUploadDir(`images/${folder}`);
  createFallbackImage(folder, "default.jpg");

  app.use(`/uploads/images/${folder}/:img`, (req, res) => {
    const file = path.join(publicUploadsPath, `images/${folder}`, req.params.img);
    const fallback = path.join(publicUploadsPath, `images/${folder}/default.jpg`);
    res.sendFile(fs.existsSync(file) ? file : fallback);
  });
});

// Serve uploads statically
app.use("/uploads", express.static(publicUploadsPath));

// 📸 Upload config
const makeUploadDir = (folder) => ensureUploadDir(`images/${folder}`);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, makeUploadDir(req.body.type || "products")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`),
});
const upload = multer({ storage });

app.post("/api/upload", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const type = req.body.type || "products";
  res.status(200).json({
    message: "Upload successful",
    imageUrl: `/uploads/images/${type}/${req.file.filename}`,
  });
});

// 🌱 Seeding
app.post("/api/seed", protect, adminOnly, async (req, res) => {
  try {
    const missingAssets = await seedDatabase(true);
    res.status(200).json({ message: "Database Seeded Successfully!", missingAssets });
  } catch (err) {
    console.error(chalk.red("❌ Seeding Error:"), err.message);
    res.status(500).json({ message: "Seeding Error", error: err.message });
  }
});

// 🧭 Load routes dynamically
const loadRoutes = async () => {
  const modules = [
    ["/api/auth", "authRoutes"],
    ["/api/users", "users"],
    ["/api/products", "products"],
    ["/api/admin", "admin"],
    ["/api/articles", "articles"],
    ["/api/contact", "contactRoutes"],
    ["/api/cart", "cart"],
    ["/api/orders", "orders"],
  ];

  for (const [route, file] of modules) {
    const { default: mod } = await import(`./routes/${file}.mjs`);
    const middlewares = file === "admin"
      ? [protect, adminOnly]
      : ["users", "orders"].includes(file)
      ? protect
      : [];
    app.use(route, middlewares, mod);
  }

  console.log(chalk.green("✅ All routes initialized successfully!"));
};

// 🔌 Connect DB then authenticate + routes
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(chalk.green(`✅ MongoDB Connected: ${mongoose.connection.host}`));

    // 🛡️ Token auth AFTER DB is ready
    app.use(authenticateToken);

    await loadRoutes();

    if (process.env.ENABLE_AUTO_SEED === "true") {
      const Product = mongoose.model("Product");
      const User = mongoose.model("User");
      const Article = mongoose.model("Article");

      const [p, u, a] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Article.countDocuments(),
      ]);

      if (p === 0 || u === 0 || a === 0) {
        console.log(chalk.blue("📥 Seeding database..."));
        await seedDatabase(true);
      } else {
        console.log(chalk.yellow("⚠️ Seeding skipped: Data already exists"));
      }
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(chalk.green(`🚀 Server running on port ${PORT}`)));
  } catch (err) {
    console.error(chalk.red("❌ DB Connection Error:"), err.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Health check
app.get("/", (req, res) => res.send("🚀 Server is up and running!"));

// 🧯 Global error handler
app.use((err, req, res, next) => {
  console.error(chalk.red("🔥 Global Error:"), err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

process.on("uncaughtException", (err) => {
  console.error(chalk.red("❗ Uncaught Exception:"), err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("❗ Unhandled Promise Rejection:"), err.message);
});
