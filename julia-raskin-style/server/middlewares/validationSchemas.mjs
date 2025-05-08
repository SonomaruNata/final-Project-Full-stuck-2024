import Joi from "joi";

/* ----------------------------------------
 🧍 User Schemas
---------------------------------------- */

// ✅ User Registration
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().label("Name"),
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
  password: Joi.string().min(6).max(30).required().label("Password"),
  role: Joi.string().valid("user", "admin").optional().label("Role"),
});

// ✅ User Login
export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
  password: Joi.string().min(6).max(30).required().label("Password"),
});

// ✅ User Profile Update
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().label("Name"),
  email: Joi.string().email({ tlds: { allow: false } }).optional().label("Email"),
  password: Joi.string().min(6).max(30).optional().label("Password"),
  birthday: Joi.date().iso().less("now").optional().label("Birthday"),

  address: Joi.object({
    street: Joi.string().optional().label("Street"),
    city: Joi.string().optional().label("City"),
    zip: Joi.string().optional().label("Zip Code"),
  }).optional(),

  paymentPreferences: Joi.object({
    cardHolderName: Joi.string().optional().label("Cardholder Name"),
    cardNumber: Joi.string().creditCard().optional().label("Card Number"),
    expiry: Joi.string().optional().label("Expiry"),
  }).optional(),
});

// ✅ Role Update
export const userRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required().label("Role"),
});

/* ----------------------------------------
 🛍️ Product Schemas
---------------------------------------- */

// ✅ Product Create
export const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Product Name"),
  description: Joi.string().min(10).max(500).required().label("Description"),
  price: Joi.number().precision(2).positive().required().label("Price"),
  category: Joi.string().min(2).max(30).required().label("Category"),
  stock: Joi.number().integer().min(0).required().label("Stock"),
  imageUrl: Joi.string().uri().optional().label("Image URL"),
});

// ✅ Product Update
export const updateProductSchema = productSchema.fork(Object.keys(productSchema.describe().keys), (field) => field.optional());

/* ----------------------------------------
 🛒 Cart
---------------------------------------- */

export const cartSchema = Joi.object({
  productId: Joi.string().required().label("Product ID"),
  quantity: Joi.number().integer().min(1).required().label("Quantity"),
});

/* ----------------------------------------
 🧾 Orders
---------------------------------------- */

// ✅ Create Order
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().label("Product ID"),
        quantity: Joi.number().integer().min(1).required().label("Quantity"),
      })
    )
    .min(1)
    .required()
    .label("Items"),

  shippingAddress: Joi.object({
    street: Joi.string().required().label("Street"),
    city: Joi.string().required().label("City"),
    state: Joi.string().required().label("State"),
    zipCode: Joi.string().required().label("Zip Code"),
    country: Joi.string().required().label("Country"),
  }).required(),

  paymentMethod: Joi.string()
    .valid("Credit Card", "PayPal", "Cash on Delivery")
    .required()
    .label("Payment Method"),
});

// ✅ Update Order Status
export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Processing", "Shipped", "Delivered", "Cancelled")
    .required()
    .label("Order Status"),
});

/* ----------------------------------------
 💬 Contact Form
---------------------------------------- */

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Name"),
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
  message: Joi.string().min(10).max(1000).required().label("Message"),
});

/* ----------------------------------------
 📰 Articles
---------------------------------------- */

// ✅ Create Article
export const createArticleSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().label("Title"),
  content: Joi.string().min(20).max(5000).required().label("Content"),
  category: Joi.string().min(3).max(50).optional().allow("").label("Category"),
  tags: Joi.array().items(Joi.string().max(30)).optional().label("Tags"),
  published: Joi.boolean().optional().label("Published"),
});

// ✅ Update Article
export const updateArticleSchema = createArticleSchema.fork(
  Object.keys(createArticleSchema.describe().keys),
  (field) => field.optional()
);
