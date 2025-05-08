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

/* ------------------------------------------
 🔐 Authenticate User by Token
------------------------------------------- */
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) return next(); // Allow public routes to pass

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const user = await User.findById(decoded.id).select("-password");

    if (user) req.user = user;
  } catch (err) {
    console.warn("❌ Invalid or expired token:", err.message);
    // Optionally: clear cookie if expired
    // res.clearCookie("token");
  }

  next();
};

/* ------------------------------------------
 🧪 Generic Joi Request Validator
------------------------------------------- */
export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.context?.key || "unknown",
        message: detail.message,
      }));
      return res.status(400).json({
        message: "❌ Validation failed",
        errors,
      });
    }

    next();
  };
};

/* ------------------------------------------
 🔐 Access Protection Middlewares
------------------------------------------- */
export const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "❌ Unauthorized. Please log in." });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "⛔ Forbidden. Admins only." });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "⛔ Forbidden. Users only." });
  }
  next();
};

/* ------------------------------------------
 🎯 Preconfigured Joi Validators
------------------------------------------- */
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

/* ------------------------------------------
 📦 Export Middleware
------------------------------------------- */
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
