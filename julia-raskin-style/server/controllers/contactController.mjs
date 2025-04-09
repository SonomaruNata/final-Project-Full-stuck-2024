import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// ✅ Schema definition (can also import it)
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).required(),
});

/**
 * 📩 Handle Contact Form Submission and send email
 */
export const handleContactForm = async (req, res) => {
  try {
    // ✅ Validate request data
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const { name, email, message } = value;

    // ✅ Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Compose and send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 Contact Form Submission from ${name}`,
      html: `
        <h2>You've received a new message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log(`✅ Contact form email sent by ${name}`);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};
