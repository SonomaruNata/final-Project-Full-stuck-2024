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
import { seedDatabase } from "./seed.mjs";
import User from "./models/User.mjs";
import Product from "./models/Product.mjs";
import Article from "./models/Article.mjs";

// ✅ Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { default: articleRoutes } = await import("./routes/articles.mjs");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);
app.use("/images", express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images")); // ✅ Save images in `public/images`
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // ✅ Unique filenames
  },
});
const upload = multer({ storage });

// ✅ **Upload Route for Images**
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: `/images/${req.file.filename}` });
});

app.use("/api/articles", articleRoutes); 




// ✅ Logging Middleware
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

// ✅ Serve Static Images from `public/images`
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ✅ MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(chalk.green(`✅ MongoDB Connected: ${mongoose.connection.host}`));

    // ✅ Ensure Routes are Initialized
    await importRoutes();

    // ✅ Enable Auto Seed Only If Needed
    const enableAutoSeed = process.env.ENABLE_AUTO_SEED === "true";

    if (enableAutoSeed) {
      console.log(chalk.blue("🔄 Checking if Auto-Seeding is Necessary..."));
    
      const productCount = await Product.countDocuments();
      const userCount = await User.countDocuments();
      const articleCount = await Article.countDocuments(); // ✅ Check if articles exist
    
      if (productCount === 0 || userCount === 0 || articleCount === 0) {
        console.log(chalk.green("🟢 Seeding Database (Products, Users, or Articles Missing)..."));
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

const importRoutes = async () => {
  try {
    const { default: authRoutes } = await import("./routes/authRoutes.mjs");
    const { default: userRoutes } = await import("./routes/users.mjs");
    const { default: productRoutes } = await import("./routes/products.mjs");
    const { default: adminRoutes } = await import("./routes/admin.mjs");
    const { default: shopRoutes } = await import("./routes/shop.mjs");
    const { default: articleRoutes } = await import("./routes/articles.mjs"); // ✅ Ensure correct import
    const { default: contactRoutes } = await import("./routes/contactRoutes.mjs");
    const { default: cartRoutes } = await import("./routes/cart.mjs");
    const { default: orderRoutes } = await import("./routes/orders.mjs");

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/shop", shopRoutes);
    app.use("/api/articles", articleRoutes); // ✅ Correctly registered
    app.use("/api/contact", contactRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/orders", orderRoutes);

    console.log(chalk.green("✅ All routes have been initialized successfully!"));
  } catch (error) {
    console.error(chalk.red(`❌ Error loading routes: ${error.message}`));
  }
};

// ✅ Ensure MongoDB Connection Before Running
connectDB();

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ✅ Global Error Handler to Prevent Crashes
process.on("uncaughtException", (err) => {
  console.error(chalk.red("🔥 Uncaught Exception:", err.message));
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("🚨 Unhandled Rejection:", err.message));
});
