import bcrypt from "bcryptjs";

// ✅ Users Data
export const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",  // ✅ Consistent role-based authorization
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
];

// ✅ Products Data
export const products = [
  {
    name: "Black Shoes",
    price: 120,
    imageUrl: "/images/products/blackshoes.jpg", // ✅ Consistent image path
    description: "Elegant black shoes perfect for any occasion.",
    category: "Footwear", // ✅ Consistent category naming
    stock: 5,
  },
  {
    name: "Outfit Set",
    price: 85,
    imageUrl: "/images/products/outfit.jpg",
    description: "Stylish outfit set with modern design.",
    category: "Clothing",
    stock: 3,
  },
  {
    name: "Sandal",
    price: 45,
    imageUrl: "/images/products/sandal.jpg",
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
    imageUrl: "/images/articles/fashion-tips.jpg",
    gallery: [
      "/images/articles/fashion1.jpg",
      "/images/articles/fashion2.jpg",
      "/images/articles/fashion3.jpg",
    ],
    tags: ["Fashion", "Tips", "Style"], // ✅ Enhanced categorization
    createdAt: new Date(),
  },
  {
    title: "How to Dress for Your Body Type",
    content: "Dressing for your body type can enhance your best features...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/articles/dress-body-type.jpg",
    gallery: [
      "/images/articles/bodytype1.jpg",
      "/images/articles/bodytype2.jpg",
      "/images/articles/bodytype3.jpg",
    ],
    tags: ["Fashion", "Body Type", "Guide"],
    createdAt: new Date(),
  },
  {
    title: "5 Wardrobe Essentials for Every Closet",
    content: "Every wardrobe should have a few essential pieces...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/articles/wardrobe-essentials.jpg",
    gallery: [
      "/images/articles/wardrobe1.jpg",
      "/images/articles/wardrobe2.jpg",
      "/images/articles/wardrobe3.jpg",
    ],
    tags: ["Fashion", "Essentials", "Wardrobe"],
    createdAt: new Date(),
  },
];
