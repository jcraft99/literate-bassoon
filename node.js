// server.js
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static('public')); // your website folder

// Storage for uploaded images
const upload = multer({ dest: 'uploads/' });

// Email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS  // app password
  }
});

// Route to handle uploads
app.post('/upload', upload.array('images'), async (req, res) => {
  try {
    const { name, email, phone, details, priceOption } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jessiecraft18@gmail.com',
      subject: `New Photoshop Request from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Selected Option: ${priceOption}
Details: ${details}
      `,
      attachments: req.files.map(file => ({
        filename: file.originalname,
        path: file.path
      }))
    };

    await transporter.sendMail(mailOptions);

    // Remove uploaded files after sending email
    req.files.forEach(f => fs.unlinkSync(f.path));

    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email.');
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
