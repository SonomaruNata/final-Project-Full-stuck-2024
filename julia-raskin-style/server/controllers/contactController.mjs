import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// ✅ Schema definition (можно импортировать отдельно)
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  message: Joi.string().min(10).max(1000).required(),
});

/**
 * 📩 Handle Contact Form Submission and send email via Brevo (SMTP)
 */
export const handleContactForm = async (req, res) => {
  try {
    // ✅ Validate input
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const { name, email, message } = value;

    // ✅ Setup Nodemailer transporter for Brevo
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: false, // Brevo uses STARTTLS
      auth: {
        user: process.env.EMAIL_USER, // your Brevo SMTP login (e.g. xxx@smtp-brevo.com)
        pass: process.env.EMAIL_PASS, // your Brevo SMTP password
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: `"Julia Raskin Style" <${process.env.EMAIL_FROM}>`, // must be verified sender
      to: process.env.EMAIL_TO || process.env.EMAIL_FROM, // receiver (admin inbox)
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h3>You've received a message from the website:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Contact message sent by ${name}`);
    res.status(200).json({ message: "Your message was sent successfully." });
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    res.status(500).json({ message: "Failed to send your message", error: err.message });
  }
};
