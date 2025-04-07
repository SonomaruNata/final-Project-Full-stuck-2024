import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import fs from "fs";
import path from "path";

import User from "./models/User.mjs";
import Product from "./models/Product.mjs";
import Article from "./models/Article.mjs";
import { users, products, articles } from "./data/initial-data.mjs";

dotenv.config();

/**
 * 📸 Copy images from seed/images/[type] ➡️ public/uploads/images/[type]
 */
const copySeedImagesByType = (type) => {
  const sourceDir = path.resolve(`seed/images/${type}`);
  const destDir = path.resolve(`public/uploads/images/${type}`);

  if (!fs.existsSync(sourceDir)) {
    console.log(chalk.red(`❌ Missing folder: seed/images/${type}`));
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(chalk.yellow(`📁 Created upload directory: uploads/images/${type}`));
  }

  const files = fs.readdirSync(sourceDir);
  if (files.length === 0) {
    console.log(chalk.yellow(`⚠️ No ${type} images found in seed/images/${type}`));
    return;
  }

  files.forEach((file) => {
    const src = path.join(sourceDir, file);
    const dest = path.join(destDir, file);

    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(chalk.green(`📸 Copied ${type} image: ${file}`));
    }
  });
};

/**
 * ✅ Verifies each data item's image reference exists in the uploads folder
 */
const verifyImageRefs = (items, type) => {
  const uploadDir = path.resolve(`public/uploads/images/${type}`);
  const fileSet = new Set(fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : []);
  const missing = [];

  items.forEach((item) => {
    const filename = path.basename(item.imageUrl || "");
    if (filename && !fileSet.has(filename)) {
      missing.push(`${item.title || item.name}: ${filename}`);
    }
  });

  if (missing.length > 0) {
    console.log(chalk.red(`❌ Missing ${type} image files:`));
    missing.forEach((msg) => console.log(`   - ${msg}`));
  } else {
    console.log(chalk.green(`✅ All ${type} image references are valid.`));
  }
};

/**
 * 🌱 Seed the entire database
 */
export const seedDatabase = async () => {
  try {
    console.log(chalk.cyan("🔁 Initializing Database Seeding..."));

    // 🖼️ Sync seed images
    copySeedImagesByType("products");
    copySeedImagesByType("articles");

    // 👤 Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(users);
      console.log(chalk.green("✅ Users seeded."));
    } else {
      console.log(chalk.yellow("⚠️ Skipping users: already exist."));
    }

    // 📦 Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(products);
      console.log(chalk.green("✅ Products seeded."));
    } else {
      console.log(chalk.yellow("⚠️ Skipping products: already exist."));
    }

    // 📰 Articles
    console.log(chalk.yellow("🔄 Replacing all articles..."));
    await Article.deleteMany();
    await Article.insertMany(articles);
    console.log(chalk.green("✅ Articles seeded."));

    // 🧪 Verify image links
    verifyImageRefs(products, "products");
    verifyImageRefs(articles, "articles");

    console.log(chalk.blueBright("🎉 Database Seeding Complete!"));
  } catch (error) {
    console.error(chalk.red(`❌ Seeding Error: ${error.message}`));
  } finally {
    mongoose.disconnect();
  }
};

// 🏁 CLI entry point
if (process.argv[2] === "--run") {
  mongoose.connect(process.env.MONGO_DB_URL).then(() => seedDatabase());
}
