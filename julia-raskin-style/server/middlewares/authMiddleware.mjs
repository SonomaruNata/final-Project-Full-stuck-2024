import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import dotenv from "dotenv";

dotenv.config();

/** 📌 Middleware to Protect Routes */
export const protect = async (req, res, next) => {
  let token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

/** 📌 Middleware to Restrict Access to Admins */
export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};
