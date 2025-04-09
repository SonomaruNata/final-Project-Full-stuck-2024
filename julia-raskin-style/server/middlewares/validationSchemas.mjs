import Joi from "joi";

/* ----------------------------------------
 🧍 User Schemas
-------------------------------------------*/

/**
 * ✅ User Registration
 */
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

/**
 * ✅ User Login
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

/**
 * ✅ User Profile Update (Partial)
 */
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).allow("").optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(30).optional(),
  birthday: Joi.date().iso().optional(),

  address: Joi.object({
    street: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    zip: Joi.string().allow("").optional(),
  }).optional(),

  paymentPreferences: Joi.object({
    cardHolderName: Joi.string().optional(),
    cardNumber: Joi.string().creditCard().optional(),
    expiry: Joi.string().optional(),
  }).optional(),
});

/**
 * ✅ User Role Update
 */
export const userRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
});

/* ----------------------------------------
 🛍️ Product Schemas
-------------------------------------------*/

/**
 * ✅ Create Product
 */
export const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().precision(2).positive().required(),
  category: Joi.string().min(2).max(30).required(),
  stock: Joi.number().integer().min(0).required(),
  imageUrl: Joi.string().uri().optional(),
});

/**
 * ✅ Update Product (Partial)
 */
export const updateProductSchema = productSchema.fork(
  ["name", "description", "price", "category", "stock", "imageUrl"],
  (field) => field.optional()
);

/* ----------------------------------------
 🛒 Cart Schema
-------------------------------------------*/

export const cartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

/* ----------------------------------------
 🧾 Order Schemas
-------------------------------------------*/

/**
 * ✅ Create Order
 */
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().optional(),
  }).required(),

  paymentMethod: Joi.string().valid("credit_card", "paypal").required(),
});

/**
 * 🔄 Update Order Status
 */
export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Processing", "Shipped", "Delivered", "Cancelled")
    .required(),
});

/* ----------------------------------------
 💬 Contact Form
-------------------------------------------*/

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
});

/* ----------------------------------------
 📰 Article Schemas
-------------------------------------------*/

/**
 * ✅ Create Article
 * NOTE: `author` is injected by backend (req.user.id), not required from frontend
 */
export const createArticleSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  content: Joi.string().min(20).max(5000).required(),
  category: Joi.string().min(3).max(50).optional().allow(""),
  tags: Joi.array().items(Joi.string().max(30)).optional(),
  published: Joi.boolean().optional(),
});

/**
 * ✅ Update Article (Partial)
 */
export const updateArticleSchema = createArticleSchema.fork(
  ["title", "content", "category", "tags", "published"],
  (field) => field.optional()
);
