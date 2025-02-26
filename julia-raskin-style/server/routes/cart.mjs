// server/routes/cartRoutes.mjs
import express from "express";
import { 
  getCart, 
  addToCart, 
  checkoutCart 
} from "../controllers/cartController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.post("/checkout", protect, checkoutCart); // ✅ Add this line for checkout

export default router;
