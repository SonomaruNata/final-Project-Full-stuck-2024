import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, "Order must have at least one item"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total must be non-negative"],
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Cash on Delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    shippingAddress: {
      type: shippingSchema,
      required: true,
    },
    orderHistory: {
      type: [historySchema],
      default: () => [{ status: "Processing", updatedAt: new Date() }],
    },
  },
  { timestamps: true }
);

// Automatically push to history on status update
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.orderHistory.push({ status: this.status });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
