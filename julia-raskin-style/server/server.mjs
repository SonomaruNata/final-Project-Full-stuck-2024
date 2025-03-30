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

// 📦 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(authenticateToken);

// 🌐 CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Accept, Authorization",
}));

// 🖼️ Serve all image types from /uploads
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// 📸 Multer Config (Generic - Supports products & articles)
const makeUploadDir = (folder) => {
  const fullPath = path.join(uploadsDir, "images", folder);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
  return fullPath;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || "products"; // Default to products
    const dir = makeUploadDir(type);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${cleanName}`);
  },
});
const upload = multer({ storage });

// 🔐 Admin-only Upload Endpoint
app.post("/api/upload", protect, adminOnly, upload.single("image"), (req, res) => {
  const type = req.body.type || "products";
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imageUrl = `/uploads/images/${type}/${req.file.filename}`;
  res.status(200).json({ message: "Upload successful", imageUrl });
});

// 🌱 Admin-only Seeding
app.post("/api/seed", protect, adminOnly, async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: "Database Seeded Successfully!" });
  } catch (err) {
    console.error(chalk.red("❌ Seeding Error:"), err.message);
    res.status(500).json({ message: "Seeding Error", error: err.message });
  }
});

// 📋 Dev Logging
app.use(morgan("dev"));
app.use(morgan((tokens, req, res) => {
  return [
    chalk.blue(tokens.method(req, res)),
    chalk.green(tokens.url(req, res)),
    tokens.status(req, res) < 400 ? chalk.bgGreen(tokens.status(req, res)) : chalk.bgRed(tokens.status(req, res)),
    chalk.gray(moment().format("YYYY-MM-DD HH:mm")),
    chalk.yellow(`${tokens["response-time"](req, res)}ms`)
  ].join(" ");
}));

// 🧠 Route Loader
const loadRoutes = async () => {
  try {
    const { default: authRoutes } = await import("./routes/authRoutes.mjs");
    const { default: userRoutes } = await import("./routes/users.mjs");
    const { default: productRoutes } = await import("./routes/products.mjs");
    const { default: adminRoutes } = await import("./routes/admin.mjs");
    const { default: articleRoutes } = await import("./routes/articles.mjs");
    const { default: contactRoutes } = await import("./routes/contactRoutes.mjs");
    const { default: cartRoutes } = await import("./routes/cart.mjs");
    const { default: orderRoutes } = await import("./routes/orders.mjs");

    // 🧭 Public APIs
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/articles", articleRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/cart", cartRoutes);

    // 🛡️ Protected
    app.use("/api/users", protect, userRoutes);
    app.use("/api/orders", protect, orderRoutes);

    // 🛠️ Admin
    app.use("/api/admin", protect, adminOnly, adminRoutes);

    console.log(chalk.green("✅ All routes initialized successfully!"));
  } catch (err) {
    console.error(chalk.red("❌ Error loading routes:"), err.message);
  }
};

// 🧩 MongoDB Connect & Server Init
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(chalk.green(`✅ MongoDB Connected: ${mongoose.connection.host}`));

    await loadRoutes();

    if (process.env.ENABLE_AUTO_SEED === "true") {
      const Product = mongoose.model("Product");
      const User = mongoose.model("User");
      const Article = mongoose.model("Article");

      const productCount = await Product.countDocuments();
      const userCount = await User.countDocuments();
      const articleCount = await Article.countDocuments();

      if (productCount === 0 || userCount === 0 || articleCount === 0) {
        console.log(chalk.blue("📥 Seeding database..."));
        await seedDatabase();
      } else {
        console.log(chalk.yellow("⚠️ Skipping seeding: Data already exists"));
      }
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(chalk.green(`🚀 Server running on port ${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red("❌ DB Connection Error:"), err.message);
    process.exit(1);
  }
};

connectDB();

// 🌐 Health Check
app.get("/", (req, res) => {
  res.send("🚀 Server is up and running!");
});

// 🧯 Global Error Handling
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
