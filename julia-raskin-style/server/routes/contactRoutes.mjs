import express from "express";
import { handleContactForm } from "../controllers/contactController.mjs";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { contactSchema } from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/* ------------------------------------------
 📩 Contact Form Route
 Handles messages from the "Contact Us" page,
 validates input, and sends to Telegram webhook.
--------------------------------------------- */

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post("/", validateRequest(contactSchema), handleContactForm);

export default router;
