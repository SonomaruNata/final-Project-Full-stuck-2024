import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt automatically
  }
);

// Optional: index for analytics or spam control
contactSchema.index({ email: 1, createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
