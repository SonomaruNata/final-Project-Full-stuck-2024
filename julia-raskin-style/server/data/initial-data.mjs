import bcrypt from "bcryptjs";

// ✅ Sample Users
export const users = [
  {
    name: "Admin User",
    email: "admadminin@example.com",  
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

// ✅ Sample Products (✅ Ensure `imageUrl` is Correct)
export const products = [
  {
    name: "Black Shoes",
    price: 120,
    imageUrl: "/images/blackshoes.jpg", // ✅ Corrected to `imageUrl`
    description: "Elegant black shoes perfect for any occasion.",
    category: "Footwear",
    stock: 1,
  },
  {
    name: "Outfit Set",
    price: 85,
    imageUrl: "/images/outfit.jpg", // ✅ Corrected to `imageUrl`
    description: "Stylish outfit set with modern design.",
    category: "Clothing",
    stock: 1,
  },
  {
    name: "Sandal",
    price: 45,
    imageUrl: "/images/sandal.jpg", // ✅ Corrected to `imageUrl`
    description: "Comfortable and stylish sandals.",
    category: "Footwear",
    stock: 1,
  },
];
export const articles = [
  {
    title: "10 Timeless Fashion Tips for Every Woman",
    content:
      "Fashion trends change, but style is eternal. Here are 10 timeless fashion tips that will help you look your best...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/fashion-tips.jpg",
    gallery: [
      "/images/fashion1.jpg",
      "/images/fashion2.jpg",
      "/images/fashion3.jpg",
    ],
  },
  {
    title: "How to Dress for Your Body Type",
    content:
      "Dressing for your body type can enhance your best features. Learn how to style yourself based on your body shape...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/dress-body-type.jpg",
    gallery: [
      "/images/bodytype1.jpg",
      "/images/bodytype2.jpg",
      "/images/bodytype3.jpg",
    ],
  },
  {
    title: "5 Wardrobe Essentials for Every Closet",
    content:
      "Every wardrobe should have a few essential pieces that never go out of style. Discover the five must-have items...",
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/wardrobe-essentials.jpg",
    gallery: [
      "/images/wardrobe1.jpg",
      "/images/wardrobe2.jpg",
      "/images/wardrobe3.jpg",
    ],
  },
];
