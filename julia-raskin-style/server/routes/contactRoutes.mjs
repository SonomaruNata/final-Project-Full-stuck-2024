import express from "express";
import { handleContactForm } from "../controllers/contactController.mjs";
import {
  validateRequest,
} from "../middlewares/validateMiddleware.mjs";
import { contactSchema } from "../middlewares/validationSchemas.mjs";

const router = express.Router();

/* ------------------------------------------
 📩 Contact Form Routes
---------------------------------------------*/

/**
 * POST /api/contact
 * @desc   Handle contact form submission
 * @access Public
 */
router.post("/", validateRequest(contactSchema), handleContactForm);

export default router;
