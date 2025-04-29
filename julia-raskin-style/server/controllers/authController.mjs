import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../middlewares/validationSchemas.mjs";

/**
 * 🔐 Generate JWT Token
 */
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/**
 * 🆕 Register a New User
 */
export const registerUser = async (req, res) => {
  try {
    validateRequest(registerSchema)(req, res, async () => {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const isAdminRequest = role === "admin";
      if (isAdminRequest && (!req.user || req.user.role !== "admin")) {
        return res.status(403).json({ message: "Unauthorized to create admin user" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: isAdminRequest ? "admin" : "user",
      });

      const token = generateToken(newUser);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log(`✅ Registered: ${newUser.name} (${newUser.email})`);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      });
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * 🔑 Login User
 */
export const loginUser = async (req, res) => {
  try {
    validateRequest(loginSchema)(req, res, async () => {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log(`✅ Logged In: ${user.name} (${user.email})`);
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * 🚪 Logout User (Clear Cookie)
 */
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  console.log("👋 User Logged Out");
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * 📄 Get Authenticated User Profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(`📄 Profile Loaded: ${user.name}`);
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Get Profile Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * ✏️ Update Authenticated User Profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    validateRequest(updateUserSchema)(req, res, async () => {
      const user = await User.findById(req.user.id).select("+password");
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, password } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;

      if (password && !(await bcrypt.compare(password, user.password))) {
        user.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await user.save();

      console.log(`✅ Profile Updated: ${updatedUser.name}`);
      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    });
  } catch (err) {
    console.error("❌ Update Profile Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
