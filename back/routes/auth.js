const express = require("express");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

const router = express.Router();

// @POST /api/auth/register
// Créer un nouvel utilisateur (inscription)
router.post("/register", async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Validation
    if (!nom || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis"
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé"
      });
    }

    // Créer l'utilisateur
    const user = new User({ nom, email, password });
    await user.save();

    // Générer un token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message
    });
  }
});

// @POST /api/auth/login
// Connexion d'un utilisateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Chercher l'utilisateur par email (inclure le password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Comparer les mots de passe
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Générer un token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Erreur connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
});

// @GET /api/auth/me
// Récupérer les infos de l'utilisateur connecté
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token manquant" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_prepfa");
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Token invalide" });
  }
});

module.exports = router;
