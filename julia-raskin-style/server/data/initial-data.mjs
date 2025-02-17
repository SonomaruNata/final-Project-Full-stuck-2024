import bcrypt from "bcryptjs";

// ✅ Users Data
export const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
    isAdmin: false,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
    isAdmin: false,
  },
];

// ✅ Products Data
export const products = [
  {
    name: "Black Shoes",
    price: 120,
    imageUrl: "blackshoes.jpg", // ✅ Store filename only
    description: "Elegant black shoes perfect for any occasion.",
    category: "Footwear",
    stock: 5,
  },
  {
    name: "Outfit Set",
    price: 85,
    imageUrl: "outfit.jpg",
    description: "Stylish outfit set with modern design.",
    category: "Clothing",
    stock: 3,
  },
  {
    name: "Sandal",
    price: 45,
    imageUrl: "sandal.jpg",
    description: "Comfortable and stylish sandals.",
    category: "Footwear",
    stock: 2,
  },
];

// ✅ Articles Data
export const articles = [
  {
    title: "10 Timeless Fashion Tips for Every Woman",
    content: "Fashion trends change, but style is eternal...",
    author: "65f1a3c3e8a1c8b8f4a789a1", // Example ObjectId
    imageUrl: "fashion-tips.jpg",
    gallery: ["fashion1.jpg", "fashion2.jpg", "fashion3.jpg"],
  },
  {
    title: "How to Dress for Your Body Type",
    content: "Dressing for your body type can enhance your best features...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "dress-body-type.jpg",
    gallery: ["bodytype1.jpg", "bodytype2.jpg", "bodytype3.jpg"],
  },
  {
    title: "5 Wardrobe Essentials for Every Closet",
    content: "Every wardrobe should have a few essential pieces...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "wardrobe-essentials.jpg",
    gallery: ["wardrobe1.jpg", "wardrobe2.jpg", "wardrobe3.jpg"],
  },
];
