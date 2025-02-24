import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import dotenv from "dotenv";

dotenv.config();

/** 
 * 📌 Middleware to Protect Routes (User Authentication) 
 * - Supports both Cookie (`req.cookies.jwt`) & Bearer Token (`req.headers.authorization`)
 * - Verifies JWT & attaches user to `req.user`
 */
export const protect = async (req, res, next) => {
  let token;

  // ✅ Check for token in cookies or Authorization header
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // 🔹 Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Find User & Attach to Request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next(); // Proceed to next middleware
  } catch (error) {
    console.error("🚨 JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

/** 
 * 📌 Middleware to Restrict Access to Admins 
 * - Ensures user exists & has `isAdmin` set to `true`
 * - Returns `403 Forbidden` if user is not an admin
 */
 export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};