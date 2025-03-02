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
import { seedDatabase } from "./seed.mjs";
import { protect, adminOnly } from "./middlewares/validateMiddleware.mjs"; // ✅ Fixed Import

// ✅ Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Enable CORS for frontend communication
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);

// ✅ Ensure `public/images` directory exists
const uploadDir = path.join(__dirname, "public/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Serve static files (images)
app.use("/images", express.static(uploadDir));

// ✅ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * ✅ **Upload Route for Images (Admin Only)**
 */
app.post("/api/upload", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: `/images/${req.file.filename}` });
});

/**
 * ✅ **Secure Seeding Route (Only Admins)**
 */
app.post("/api/seed", protect, adminOnly, async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: "Database Seeded Successfully!" });
  } catch (error) {
    console.error(chalk.red("❌ Seeding Error:"), error.message);
    res.status(500).json({ message: "Seeding Error", error: error.message });
  }
});

/**
 * ✅ **Logging Middleware**
 */
app.use(morgan("dev"));
app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.blue(tokens.method(req, res)),
      chalk.green(tokens.url(req, res)),
      tokens.status(req, res) >= 200 && tokens.status(req, res) < 400
        ? chalk.bgGreen(tokens.status(req, res))
        : chalk.bgRed(tokens.status(req, res)),
      chalk.gray(moment().format("YYYY-MM-DD HH:mm")),
      chalk.bgBlack(tokens["response-time"](req, res), "ms"),
    ].join(" ");
  })
);

/**
 * ✅ **MongoDB Connection**
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(chalk.green(`✅ MongoDB Connected: ${mongoose.connection.host}`));

    // ✅ Ensure Routes are Initialized
    await importRoutes();

    // ✅ Enable Auto Seed If Required
    if (process.env.ENABLE_AUTO_SEED === "true") {
      console.log(chalk.blue("🔄 Checking if Auto-Seeding is Necessary..."));

      const productCount = await mongoose.model("Product").countDocuments();
      const userCount = await mongoose.model("User").countDocuments();
      const articleCount = await mongoose.model("Article").countDocuments();

      if (productCount === 0 || userCount === 0 || articleCount === 0) {
        console.log(chalk.green("🟢 Seeding Database..."));
        await seedDatabase();
      } else {
        console.log(chalk.yellow("⚠️ Auto-Seeding Skipped. Data already exists."));
      }
    }

    // ✅ Start Server AFTER Database Connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(chalk.green(`🚀 Server running on port ${PORT}`));
    });

  } catch (error) {
    console.error(chalk.red(`❌ MongoDB Connection Error: ${error.message}`));
    process.exit(1);
  }
};

/**
 * ✅ **Import & Initialize Routes**
 */
const importRoutes = async () => {
  try {
    const { default: authRoutes } = await import("./routes/authRoutes.mjs");
    const { default: userRoutes } = await import("./routes/users.mjs");
    const { default: productRoutes } = await import("./routes/products.mjs");
    const { default: adminRoutes } = await import("./routes/admin.mjs");
    const { default: articleRoutes } = await import("./routes/articles.mjs");
    const { default: contactRoutes } = await import("./routes/contactRoutes.mjs");
    const { default: cartRoutes } = await import("./routes/cart.mjs");
    const { default: orderRoutes } = await import("./routes/orders.mjs");

    // ✅ Public Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/articles", articleRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/products", productRoutes); // ✅ No Authentication Required for Product Routes

    // ✅ Protected Routes (Require Authentication)
    app.use("/api/users", protect, userRoutes);
    app.use("/api/orders", protect, orderRoutes);

    // ✅ Admin Routes
    app.use("/api/admin", protect, adminOnly, adminRoutes);

    console.log(chalk.green("✅ All routes initialized successfully!"));
  } catch (error) {
    console.error(chalk.red(`❌ Error loading routes: ${error.message}`));
  }
};

// ✅ Ensure MongoDB Connection Before Running Server
connectDB();

/**
 * ✅ **Root Route**
 */
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

/**
 * ✅ **Global Error Handlers (Prevents Server Crash)**
 */
app.use((err, req, res, next) => {
  console.error(chalk.red("🔥 Global Error Handler:"), err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

process.on("uncaughtException", (err) => {
  console.error(chalk.red("🔥 Uncaught Exception:"), err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("🚨 Unhandled Rejection:"), err.message);
});
