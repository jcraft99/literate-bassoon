// server.js

// ====== IMPORTS ======
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

// ====== PATH FIX (for ES modules) ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== APP SETUP ======
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== FILE UPLOAD SETUP ======
const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ====== SERVE FRONTEND FILES ======
app.use(express.static(__dirname));

// ====== CONTACT FORM ENDPOINT ======
app.post("/send", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, message, service } = req.body;
    const file = req.file;

    // ====== EMAIL SETUP ======
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ====== EMAIL CONTENT ======
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // You’ll get the message yourself
      subject: `New Photoshop Request from ${name}`,
      text: `
New Photoshop request received:

Name: ${name}
Email: ${email}
Selected Package: ${service}

Message:
${message}
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path,
            },
          ]
        : [],
    };

    // ====== SEND EMAIL ======
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// ====== START SERVER ======
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
