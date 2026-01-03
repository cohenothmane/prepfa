const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Routes test
app.get("/", (req, res) => res.send("Hello Amine"));

// Routes d'authentification
app.use("/api/auth", authRoutes);

/**
 * Logs MongoDB (très utile)s
 */
mongoose.connection.on("connected", () => console.log("✅ [event] mongoose connected"));
mongoose.connection.on("error", (err) => console.error("❌ [event] mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ [event] mongoose disconnected"));

// Force un timeout pour ne pas rester “bloqué” sans message
const connectWithTimeout = async () => {
  const timeoutMs = 15000;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`⏱️ Timeout MongoDB après ${timeoutMs}ms`)), timeoutMs)
  );

  try {
    await Promise.race([
      mongoose.connect(process.env.MONGO_URI),
      timeoutPromise
    ]);

    console.log("✅ MongoDB connecté");

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log("Amine tu es prêt à travailler avec mon serveurrrrr 😄");
    });
  } catch (err) {
    console.error("❌ Erreur MongoDB (catch):", err);
    process.exit(1);
  }
};

connectWithTimeout();
