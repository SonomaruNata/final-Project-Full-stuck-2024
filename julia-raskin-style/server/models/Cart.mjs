import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  imageUrl: {
    type: String,
    required: false, // ✅ Can be populated from product model if needed
  },
  price: {
    type: Number,
    required: false, // ✅ Optional: store snapshot of product price at time of add
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: {
    type: [cartItemSchema],
    default: [],
  },
  total: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // ✅ Includes createdAt + updatedAt
});

// Optional: Pre-save hook to recalculate total
cartSchema.pre("save", function (next) {
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.quantity * (item.price || 0));
  }, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
