import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { validateRequest } from "../middlewares/validateMiddleware.mjs";
import { contactSchema } from "../middlewares/validationSchemas.mjs";

dotenv.config();

/**
 * ✅ **Handle Contact Form Submission**
 */
export const handleContactForm = async (req, res) => {
  try {
    // ✅ Validate request data using Joi schema
    validateRequest(contactSchema)(req, res, async () => {
      const { name, email, message } = req.body;

      // ✅ Setup Nodemailer Transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || 587,
        secure: false, // Use `true` for 465, `false` for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // ✅ Send Email
      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        text: message,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log(`✅ Contact form submitted successfully by ${name}`);
      res.status(200).json({ message: "Message sent successfully" });
    });
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};
