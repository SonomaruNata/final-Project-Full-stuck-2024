import express from "express";
import {
  validateRequest,
} from "../middlewares/validateMiddleware.mjs"; // ✅ Ensured correct path
import { contactSchema } from "../middlewares/validationSchemas.mjs"; // ✅ Moved schema import to the correct place
import { handleContactForm } from "../controllers/contactController.mjs";

const router = express.Router();

/**
 * 📩 **Contact Form Routes**
 * - `POST /` ➝ Submit contact form (Validation Included)
 */
router.post("/", validateRequest(contactSchema), handleContactForm);

export default router;
