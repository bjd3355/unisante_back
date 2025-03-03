// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser le JSON dans le body des requêtes
app.use(express.json());

// Base de données simulée (tableau en mémoire)
let users = [];

// Endpoint d'inscription (API d'inscription)
app.post("/users", (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  // Validation basique
  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  // Vérification si l'utilisateur existe déjà (email unique)
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ error: "Cet email est déjà utilisé." });
  }

  // Création de l'utilisateur
  const newUser = {
    id: users.length + 1,
    nom,
    prenom,
    email,
    password, // ATTENTION : en production, n'oubliez pas de hasher le mot de passe !
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Ajout de l'utilisateur à la base de données simulée
  users.push(newUser);

  // Renvoi de la réponse avec l'utilisateur créé
  return res.status(201).json(newUser);
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
