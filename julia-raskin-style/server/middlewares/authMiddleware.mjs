import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

/**
 * ✅ Protect Routes (Authentication Middleware)
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

/**
 * ✅ Admin Only Middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin only" });
  }
};

/**
 * ✅ User Only Middleware
 */
export const userOnly = (req, res, next) => {
  if (req.user && (req.user.role === "user" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: User only" });
  }
};
