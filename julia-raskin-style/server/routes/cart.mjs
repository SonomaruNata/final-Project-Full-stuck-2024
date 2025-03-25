import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.mjs";
import {
  protect,
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";
import { cartSchema } from "../middlewares/validationSchemas.mjs";

const router = express.Router();

// All routes are protected below
router.use(protect);

router.post("/", validateRequest(cartSchema), addToCart);
router.get("/", getCart);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;