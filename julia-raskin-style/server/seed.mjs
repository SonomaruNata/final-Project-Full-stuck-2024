import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import User from "./models/User.mjs";
import Product from "./models/Product.mjs";
import Article from "./models/Article.mjs";
import { users, products, articles } from "./data/initial-data.mjs";

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log(chalk.yellow("🔄 Seeding Database..."));

    // ✅ Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(users);
      console.log(chalk.green("✅ Users Seeded Successfully!"));
    } else {
      console.log(chalk.yellow("⚠️ Users already exist. Skipping user seeding."));
    }

    // ✅ Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(products);
      console.log(chalk.green("✅ Products Seeded Successfully!"));
    } else {
      console.log(chalk.yellow("⚠️ Products already exist. Skipping product seeding."));
    }

    // ✅ Seed Articles
    console.log(chalk.yellow("🔄 Refreshing Articles Collection..."));
    await Article.deleteMany({}); // ⛔ Clear Articles Collection
    await Article.insertMany(articles); // ✅ Seed New Articles
    console.log(chalk.green("✅ Articles Seeded Successfully!"));

    console.log(chalk.blue("🚀 Database Seeding Complete!"));
  } catch (error) {
    console.error(chalk.red(`❌ Seeding Error: ${error.message}`));
  } finally {
    mongoose.disconnect();
  }
};

// ✅ Run Seeding only when script is executed directly
if (process.argv[2] === "--run") {
  mongoose.connect(process.env.MONGO_DB_URL).then(() => seedDatabase());
}