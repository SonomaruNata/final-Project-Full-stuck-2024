import bcrypt from "bcryptjs";

// ✅ Users Data
export const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
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
    imageUrl: "blackshoes.jpg",
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
    content: `
      In a world where trends come and go, mastering timeless fashion is the key to always looking elegant and stylish. 
      These 10 essential fashion tips for women are designed to help you build a versatile wardrobe that stands the test of time.
      From investing in quality basics to accessorizing strategically, discover how to create effortless and classic looks. 
      Whether you’re attending a formal event or just running errands, these timeless fashion tips will keep you looking chic and confident. 
      Don't just follow trends—set them with your unique style!
    `,
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/articles/fashion-tips.jpg",
    gallery: [
      "/images/articles/fashion1.jpg",
      "/images/articles/fashion2.jpg",
      "/images/articles/fashion3.jpg",
    ],
    tags: ["Fashion", "Style Tips", "Timeless Fashion", "Wardrobe Essentials"],
    createdAt: new Date(),
  },
  {
    title: "How to Dress for Your Body Type",
    content: `
      Dressing for your body type is the secret to looking and feeling your best. 
      Understanding your unique silhouette allows you to highlight your best features and feel confident in every outfit. 
      Whether you have an hourglass, pear, apple, or athletic body type, this guide provides tailored fashion advice that enhances your shape.
      From choosing the right cuts and fabrics to styling tricks that elongate your figure, learn how to dress strategically and elegantly.
      Discover the power of dressing for your body type and transform your wardrobe with ease.
    `,
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/articles/dress-body-type.jpg",
    gallery: [
      "/images/articles/bodytype1.jpg",
      "/images/articles/bodytype2.jpg",
      "/images/articles/bodytype3.jpg",
    ],
    tags: ["Fashion", "Body Type Guide", "Styling Tips", "Personal Style"],
    createdAt: new Date(),
  },
  {
    title: "5 Wardrobe Essentials for Every Closet",
    content: `
      Building a versatile wardrobe starts with the right essentials. 
      These five must-have wardrobe pieces form the foundation of countless stylish outfits, ensuring you’re prepared for any occasion.
      From the classic white shirt to perfectly fitted jeans, discover the key wardrobe staples every woman needs. 
      Learn how to mix and match these essentials to create effortlessly chic looks for work, casual outings, and evening events.
      By investing in timeless basics, you’ll never face the dilemma of having nothing to wear again!
    `,
    author: "65f1a3c3e8a1c8b8f4a789a1",
    imageUrl: "/images/articles/wardrobe-essentials.jpg",
    gallery: [
      "/images/articles/wardrobe1.jpg",
      "/images/articles/wardrobe2.jpg",
      "/images/articles/wardrobe3.jpg",
    ],
    tags: ["Fashion", "Wardrobe Essentials", "Style Basics", "Timeless Clothing"],
    createdAt: new Date(),
  },
];
