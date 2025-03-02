import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { registerSchema, loginSchema, updateUserSchema } from "../middlewares/validationSchemas.mjs";

/**
 * ✅ Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * ✅ Register User
 */
export const registerUser = async (req, res) => {
  try {
    // ✅ Validate input using Joi schema
    validateRequest(registerSchema)(req, res, async () => {
      const { name, email, password, role } = req.body;

      // ❌ Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // ✅ Role validation: Only allow 'admin' if created by an existing admin
      let userRole = role || "user";
      if (userRole === "admin") {
        if (!req.user || req.user.role !== "admin") {
          return res.status(403).json({ message: "Unauthorized to create admin user" });
        }
      }

      // ✅ Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create and save user
      const newUser = await User.create({ name, email, password: hashedPassword, role: userRole });

      // ✅ Generate token and set secure cookie
      const token = generateToken(newUser);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      console.log(`✅ New User Registered: ${newUser.name} (${newUser.email})`);

      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        token,
      });
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Login User
 */
export const loginUser = async (req, res) => {
  try {
    // ✅ Validate input using Joi schema
    validateRequest(loginSchema)(req, res, async () => {
      const { email, password } = req.body;

      // ❌ Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ❌ Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ Generate token and set secure cookie
      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      console.log(`✅ User Logged In: ${user.name} (${user.email})`);

      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Logout User
 */
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  console.log("✅ User Logged Out");
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * ✅ Get User Profile (Protected)
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ Profile Loaded: ${user.name} (${user.email})`);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get Profile Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Update User Profile (Protected)
 */
export const updateUserProfile = async (req, res) => {
  try {
    // ✅ Validate input using Joi schema
    validateRequest(updateUserSchema)(req, res, async () => {
      const { name, email, password } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.email = email || user.email;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await user.save();

      console.log(`✅ Profile Updated: ${updatedUser.name} (${updatedUser.email})`);

      res.status(200).json({
        message: "Profile updated successfully",
        user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role },
      });
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
