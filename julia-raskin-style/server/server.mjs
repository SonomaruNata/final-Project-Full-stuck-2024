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

// 🛠️ Load environment variables
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔧 Express App
const app = express();

// 🧾 Logger w/ timestamp
const morganFormat = (tokens, req, res) => [
  chalk.cyan(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`),
  chalk.magenta(tokens.method(req, res)),
  chalk.green(tokens.url(req, res)),
  chalk.yellow(tokens.status(req, res)),
  chalk.gray(`${tokens["response-time"](req, res)}ms`),
].join(" ");

app.use(morgan(morganFormat));

// 🧩 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Accept, Authorization",
}));

/* ----------------------------------------
📂 Static Upload Path Config & Setup
---------------------------------------- */
const publicUploadsPath = path.join(__dirname, "public/uploads");
const fallbackBase64 = "iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAACZcO2pAAAAFElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAwF+lAAEE1R5fAAAAAElFTkSuQmCC";

const ensureUploadDir = (subPath) => {
  const dir = path.join(publicUploadsPath, subPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(chalk.yellow(`📁 Created: /uploads/${subPath}`));
  }
  return dir;
};

const createFallbackImage = (folder, filename) => {
  const target = path.join(publicUploadsPath, "images", folder, filename);
  if (!fs.existsSync(target)) {
    const buffer = Buffer.from(fallbackBase64, "base64");
    fs.writeFileSync(target, buffer);
    console.log(chalk.green(`🧩 Fallback image created at: ${target}`));
  }
};

// Ensure folders exist and setup fallback handlers
["products", "articles"].forEach((folder) => {
  ensureUploadDir(`images/${folder}`);
  createFallbackImage(folder, "default.jpg");

  app.use(`/uploads/images/${folder}/:img`, (req, res) => {
    const filePath = path.join(publicUploadsPath, "images", folder, req.params.img);
    const fallback = path.join(publicUploadsPath, "images", folder, "default.jpg");
    res.sendFile(fs.existsSync(filePath) ? filePath : fallback);
  });
});

// ✅ Serve static /uploads
app.use("/uploads", express.static(publicUploadsPath));

/* ----------------------------------------
📤 Image Upload Endpoint
---------------------------------------- */
const ALLOWED_UPLOAD_TYPES = ["products", "articles"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = (req.body.type || "").toLowerCase();
    const folder = ALLOWED_UPLOAD_TYPES.includes(type) ? type : "products";
    const dest = path.join(publicUploadsPath, "images", folder);
    ensureUploadDir(`images/${folder}`);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const clean = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${clean}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("❌ Only JPG, PNG, or WEBP allowed"));
  }
});

app.post("/api/upload", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded." });
  }

  const type = ALLOWED_UPLOAD_TYPES.includes(req.body.type)
    ? req.body.type
    : "products";

  res.status(200).json({
    message: "✅ Upload successful",
    imageUrl: `/uploads/images/${type}/${req.file.filename}`,
  });
});

/* ----------------------------------------
🌱 Seed Database
---------------------------------------- */
app.post("/api/seed", protect, adminOnly, async (req, res) => {
  try {
    const result = await seedDatabase(true);
    res.status(200).json({ message: "✅ Seeded", result });
  } catch (err) {
    console.error(chalk.red("❌ Seeding Error:"), err.message);
    res.status(500).json({ message: "Seeding failed", error: err.message });
  }
});

/* ----------------------------------------
📦 Dynamic Route Loader
---------------------------------------- */
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

  for (const [route, modFile] of modules) {
    const { default: module } = await import(`./routes/${modFile}.mjs`);
    const mw = modFile === "admin" ? [protect, adminOnly]
              : ["users", "orders"].includes(modFile) ? [protect]
              : [];
    app.use(route, ...mw, module);
  }

  console.log(chalk.green("✅ All routes initialized successfully!"));
};

/* ----------------------------------------
🔌 Connect to MongoDB & Start Server
---------------------------------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(chalk.green(`✅ MongoDB Connected: ${mongoose.connection.host}`));

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
        console.log(chalk.blue("📥 Auto-seeding..."));
        await seedDatabase(true);
      } else {
        console.log(chalk.yellow("⚠️ Seeding skipped — data exists."));
      }
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(chalk.green(`🚀 Server running on port ${PORT}`)));

  } catch (err) {
    console.error(chalk.red("❌ MongoDB Connection Failed:"), err.message);
    process.exit(1);
  }
};

connectDB();

/* ----------------------------------------
🧪 Health Check + Global Error Handler
---------------------------------------- */
app.get("/", (req, res) => res.send("🚀 Server is up and running!"));

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