// app.js
require('dotenv').config(); // Pour charger les variables d'environnement depuis un fichier .env
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json()); // Parse les requêtes JSON

// Configuration de Nodemailer (ici, avec Gmail)
// Assurez-vous d'avoir défini EMAIL_USER et EMAIL_PASS dans votre fichier .env
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Exemple: votre.email@gmail.com
    pass: process.env.EMAIL_PASS  // Votre mot de passe ou clé d'application
  }
});

// Endpoint pour envoyer le code
app.post('/api/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email est requis.' });
  }
  
  // Génération d'un code aléatoire à 4 chiffres
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Votre code de vérification',
    text: `Bonjour,\n\nVoici votre code de vérification : ${code}\n\nMerci.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Code envoyé à ${email} : ${code}`);
    // En production, stockez ce code côté serveur (ex. en base de données ou dans une session)
    // et ne le renvoyez pas dans la réponse.
    res.status(200).json({ message: 'Code envoyé avec succès.', code });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code :', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du code.' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
