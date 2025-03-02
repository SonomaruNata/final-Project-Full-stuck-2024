import Joi from "joi";

/**
 * ✅ **User Registration Schema**
 */
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

/**
 * ✅ **User Login Schema**
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

/**
 * ✅ **User Profile Update Schema**
 */
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(30).optional(),
  birthday: Joi.date().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    zip: Joi.string().optional(),
  }).optional(),
  paymentPreferences: Joi.object({
    cardHolderName: Joi.string().optional(),
  }).optional(),
});

/**
 * ✅ **Product Schema (Create)**
 */
export const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().precision(2).positive().required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  imageUrl: Joi.string().optional(),
});

/**
 * ✅ **Product Update Schema**
 * - Allows **partial updates** by making all fields **optional**.
 */
export const updateProductSchema = productSchema.fork(
  ["name", "description", "price", "category", "stock", "imageUrl"],
  (schema) => schema.optional()
);

/**
 * ✅ **Order Schema**
 */
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().valid("credit_card", "paypal").required(),
});

/**
 * ✅ **Order Status Update Schema**
 * - Ensures only valid order statuses can be set.
 */
export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Processing", "Shipped", "Delivered", "Cancelled")
    .required(),
});

/**
 * ✅ **Contact Form Schema**
 */
export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
});

/**
 * ✅ **User Role Update Schema**
 */
export const userRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
});

/**
 * ✅ **Cart Schema**
 */
export const cartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

/**
 * ✅ **Article Schema (Create & Update)**
 */
export const createArticleSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  content: Joi.string().min(20).max(5000).required(),
  author: Joi.string().required(),
  category: Joi.string().min(3).max(50).optional(),
  tags: Joi.array().items(Joi.string().max(30)).optional(),
  published: Joi.boolean().optional(),
});

/**
 * ✅ **Article Update Schema**
 * - Allows **partial updates**.
 */
export const updateArticleSchema = createArticleSchema.fork(
  ["title", "content", "category", "tags", "published"],
  (schema) => schema.optional()
);
