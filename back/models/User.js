const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est requis"],
    trim: true,
    minlength: [2, "Le nom doit avoir au moins 2 caractères"],
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis"],
    minlength: [6, "Le mot de passe doit avoir au moins 6 caractères"],
    select: false, // Ne pas retourner le password par défaut
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Middleware: hacher le mot de passe avant de sauvegarder (version propre)
userSchema.pre("save", async function () {
  // Si le mot de passe n'a pas été modifié, on ne fait rien
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Méthode: comparer les mots de passe
userSchema.methods.comparePassword = async function (passwordEntered) {
  return bcrypt.compare(passwordEntered, this.password);
};

module.exports = mongoose.model("User", userSchema);
