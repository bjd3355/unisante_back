import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"Test UNISANTE" <${process.env.EMAIL_USER}>`,
  to: "jophretbakana@gmail.com",
  subject: "Test d'envoi d'email",
  text: "Ceci est un test d'envoi d'email avec Nodemailer",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Erreur lors de l'envoi :", error);
  } else {
    console.log("Email envoyé !", info.response);
  }
});
