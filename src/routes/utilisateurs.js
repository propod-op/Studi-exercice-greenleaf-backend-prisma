import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/utilisateurs
router.get("/", async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(utilisateurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/utilisateurs
router.post("/", async (req, res) => {
  const { nom, email } = req.body;

  if (!nom || !email) {
    return res.status(400).json({ error: "nom et email sont requis" });
  }

  try {
    const utilisateur = await prisma.utilisateur.create({
      data: { nom, email },
    });
    res.status(201).json(utilisateur);
  } catch (err) {
    // P2002 = violation de contrainte d'unicité (email déjà pris)
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Cet email existe déjà" });
    }
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
