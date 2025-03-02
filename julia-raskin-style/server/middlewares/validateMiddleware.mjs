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
 * ✅ **Middleware for Validating Request Data Using Joi Schemas**
 * @param {Joi.Schema} schema - Joi schema object for validation
 * @param {string} property - The request property to validate (body, params, query)
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
 * ✅ **Middleware for Protecting Routes (Authentication Required)**
 */
export const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next();
};

/**
 * ✅ **Middleware for Admin-Only Routes**
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access only" });
  }
  next();
};

/**
 * ✅ **Middleware for User-Only Routes**
 */
export const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "Forbidden: Users only access" });
  }
  next();
};

/**
 * ✅ **Middleware: Validate Requests**
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

