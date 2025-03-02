import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { updateUserSchema, userRoleSchema } from "../middlewares/validationSchemas.mjs";

/**
 * ✅ **Get User Profile**
 * - Allows logged-in users to view their profile.
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();

    if (!user) {
      console.error("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User Profile Fetched: ${user.email}`);
    res.status(200).json(user);
  } catch (error) {
    console.error(`❌ Get User Profile Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ **Update User Profile**
 * - Allows logged-in users to update their profile.
 */
export const updateUserProfile = async (req, res) => {
  try {
    validateRequest(updateUserSchema)(req, res, async () => {
      const user = await User.findById(req.user.id);

      if (!user) {
        console.error("❌ User not found");
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ Update Basic Information
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.birthday = req.body.birthday || user.birthday;

      // ✅ Update Address
      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      // ✅ Update Payment Preferences
      if (req.body.paymentPreferences) {
        user.paymentPreferences = {
          ...user.paymentPreferences,
          ...req.body.paymentPreferences,
        };
      }

      // ✅ Hash and Update Password (if provided)
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      console.log(`✅ Profile Updated: ${updatedUser.email}`);

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          birthday: updatedUser.birthday,
          address: updatedUser.address,
          paymentPreferences: updatedUser.paymentPreferences,
        },
      });
    });
  } catch (error) {
    console.error(`❌ Update User Profile Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔑 **Admin: Get All Users**
 * - Allows admins to view all registered users.
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    console.log("✅ All Users Fetched");

    res.status(200).json(users);
  } catch (error) {
    console.error(`❌ Get All Users Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔑 **Admin: Update User Role**
 * - Allows admins to update user roles (e.g., promote to admin).
 */
export const updateUserRole = async (req, res) => {
  try {
    validateRequest(userRoleSchema)(req, res, async () => {
      const user = await User.findById(req.params.id);

      if (!user) {
        console.error("❌ User not found");
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent Admins from demoting themselves
      if (user._id.toString() === req.user.id) {
        console.error("❌ Admin cannot demote themselves");
        return res.status(400).json({ message: "You cannot change your own role" });
      }

      user.role = req.body.role;
      await user.save();
      console.log(`✅ User Role Updated: ${user.email}`);

      res.status(200).json({ message: "User role updated successfully" });
    });
  } catch (error) {
    console.error(`❌ Update User Role Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔑 **Admin: Delete User**
 * - Allows admins to delete user accounts.
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      console.error("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User Deleted: ${user.email}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`❌ Delete User Error: ${error.message}`);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
