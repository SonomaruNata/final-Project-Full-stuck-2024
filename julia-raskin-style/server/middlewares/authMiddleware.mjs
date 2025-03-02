// server/middlewares/authMiddleware.mjs

import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

/**
 * ✅ Protect Routes (Authentication Middleware)
 */
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (error) {
    console.error("❌ Token Error:", error.message);
    res.status(401).json({ message: "Unauthorized, token failed or expired" });
  }
};

/**
 * ✅ Admin Only Middleware
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    console.error("❌ AdminOnly Error: User is not authenticated");
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }

  if (req.user.role !== "admin") {
    console.error(`❌ AdminOnly Error: Access denied for role - ${req.user.role}`);
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  console.log(`✅ Admin Access Granted: ${req.user.email}`);
  next();
};

/**
 * ✅ User Only Middleware
 */
export const userOnly = (req, res, next) => {
  if (!req.user) {
    console.error("❌ UserOnly Error: User is not authenticated");
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }

  if (req.user.role !== "user") {
    console.error(`❌ UserOnly Error: Access denied for role - ${req.user.role}`);
    return res.status(403).json({ message: "Access denied: Users only" });
  }

  console.log(`✅ User Access Granted: ${req.user.email}`);
  next();
};
