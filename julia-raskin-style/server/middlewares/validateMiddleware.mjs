import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  productSchema,
  updateProductSchema,
  createOrderSchema,
  contactSchema,
  userRoleSchema,
  cartSchema,
  createArticleSchema,
  updateArticleSchema,
  orderStatusSchema,
} from "./validationSchemas.mjs";

/**
 * 🔐 Authenticate Token (JWT)
 * - Decodes JWT from header or cookie and attaches `req.user`
 */
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) return next(); // Pass through, `protect` will block if needed

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    console.error("❌ Token decode failed:", err.message);
  }

  next();
};

/**
 * 🧪 Validate Request Using Joi Schema
 * @param {Joi.Schema} schema - Validation schema
 * @param {string} property - Request property to validate (default: "body")
 */
export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.context?.key || "unknown",
        message: err.message,
      }));
      return res.status(400).json({ message: "Validation failed", errors });
    }

    next();
  };
};

/**
 * 🛡 Protect Route Middleware (Requires Auth)
 */
export const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next();
};

/**
 * 🔐 Admin-Only Access Middleware
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access only" });
  }
  next();
};

/**
 * 👤 User-Only Access Middleware
 */
export const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "Forbidden: Users only access" });
  }
  next();
};

/**
 * 🧩 Pre-built Validators from Joi Schemas
 */
export const validateRegister = validateRequest(registerSchema);
export const validateLogin = validateRequest(loginSchema);
export const validateUserUpdate = validateRequest(updateUserSchema);
export const validateProductCreation = validateRequest(productSchema);
export const validateProductUpdate = validateRequest(updateProductSchema);
export const validateOrderCreation = validateRequest(createOrderSchema);
export const validateOrderStatusUpdate = validateRequest(orderStatusSchema);
export const validateContactForm = validateRequest(contactSchema);
export const validateArticleCreation = validateRequest(createArticleSchema);
export const validateArticleUpdate = validateRequest(updateArticleSchema);
export const validateUserRoleUpdate = validateRequest(userRoleSchema);
export const validateCartOperation = validateRequest(cartSchema);

/**
 * ✅ Export as Middleware Object (Optional use-case)
 */
export default {
  authenticateToken,
  protect,
  adminOnly,
  userOnly,
  validateRequest,
  validateRegister,
  validateLogin,
  validateUserUpdate,
  validateProductCreation,
  validateProductUpdate,
  validateOrderCreation,
  validateOrderStatusUpdate,
  validateContactForm,
  validateArticleCreation,
  validateArticleUpdate,
  validateUserRoleUpdate,
  validateCartOperation,
};
