import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { updateUserSchema, userRoleSchema } from "../middlewares/validationSchemas.mjs";

/**
 * 👤 Get Profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get Profile Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✏️ Update Profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    validateRequest(updateUserSchema)(req, res, async () => {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.birthday = req.body.birthday || user.birthday;

      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      if (req.body.paymentPreferences) {
        user.paymentPreferences = {
          ...user.paymentPreferences,
          ...req.body.paymentPreferences,
        };
      }

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }

      const updated = await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updated._id,
          name: updated.name,
          email: updated.email,
          birthday: updated.birthday,
          address: updated.address,
          paymentPreferences: updated.paymentPreferences,
        },
      });
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * 🔑 Admin: Update User Role
 */
export const updateUserRole = async (req, res) => {
  try {
    validateRequest(userRoleSchema)(req, res, async () => {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user._id.toString() === req.user.id) {
        return res.status(400).json({ message: "Cannot change your own role" });
      }

      user.role = req.body.role;
      await user.save();

      res.status(200).json({ message: "User role updated" });
    });
  } catch (error) {
    console.error("❌ Role Update Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ❌ Delete User (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("❌ Delete User Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
