import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import User from "./models/User.mjs";
import Product from "./models/Product.mjs";
import Article from "./models/Article.mjs"; // ✅ Ensure this is imported
import { users, products, articles } from "./data/initial-data.mjs";

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log(chalk.yellow("🔄 Seeding Database..."));

    // ✅ Check & Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(users);
      console.log(chalk.green("✅ Users Seeded Successfully!"));
    } else {
      console.log(chalk.yellow("⚠️ Users already exist. Skipping user seeding."));
    }

    // ✅ Check & Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(products);
      console.log(chalk.green("✅ Products Seeded Successfully!"));
    } else {
      console.log(chalk.yellow("⚠️ Products already exist. Skipping product seeding."));
    }

    // ✅ Check & Seed Articles
    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
      await Article.insertMany(articles);
      console.log(chalk.green("✅ Articles Seeded Successfully!"));
    } else {
      console.log(chalk.yellow("⚠️ Articles already exist. Skipping article seeding."));
    }

    console.log(chalk.blue("🚀 Database Seeding Complete!"));
  } catch (error) {
    console.error(chalk.red(`❌ Seeding Error: ${error.message}`));
  }
};

// ✅ Run Seeding only when script is executed directly
if (process.argv[2] === "--run") {
  mongoose.connect(process.env.MONGO_DB_URL).then(() => seedDatabase());
}
