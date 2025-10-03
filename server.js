import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

// Configuration CORS pour permettre les requêtes depuis n'importe quel domaine
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialisation de l'API Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "TA_CLE_API_ICI");

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Serveur LIFE AI Santé fonctionne !",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// Route pour les requêtes de santé
app.post("/api/message", async (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === "") {
    return res.status(400).json({ 
      error: "Message vide",
      message: "Veuillez fournir un message valide"
    });
  }

  try {
    // Configuration du modèle Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Prompt spécialisé pour les questions de santé
    const prompt = `Tu es LIFE AI, un assistant médical intelligent et bienveillant. Réponds à cette question de santé de manière professionnelle, précise et accessible. Si la question nécessite un diagnostic médical urgent, recommande de consulter un professionnel de santé.

Question: ${text}

Réponds en français, de manière claire et structurée:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ 
      reply: reply,
      timestamp: new Date().toISOString(),
      model: "gemini-pro"
    });

  } catch (error) {
    console.error("Erreur API Google Generative AI:", error);
    
    // Réponse de fallback en cas d'erreur
    const fallbackResponse = "Je rencontre actuellement des difficultés techniques. Pour des questions médicales urgentes, veuillez consulter un professionnel de santé ou contacter les services d'urgence.";
    
    res.status(500).json({ 
      error: "Erreur serveur IA",
      reply: fallbackResponse,
      details: error.message
    });
  }
});

// Route pour vérifier la santé de l'API
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "LIFE AI Santé",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    message: "Cette route n'existe pas sur le serveur LIFE AI"
  });
});

// Configuration du port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur LIFE AI lancé sur le port ${PORT}`);
  console.log(`📱 Prêt pour les requêtes mobiles`);
  console.log(`🔗 URL locale: http://localhost:${PORT}`);
});
