import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/services
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { id: "asc" },
    });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req, res) => {
  const { nom, description, prix } = req.body;
  if (!nom || !description || !prix) {
    return res
      .status(400)
      .json({ error: "nom, description et prix sont requis" });
  }
  try {
    const services = await prisma.service.create({
      data: { nom, description, prix },
    });
    res.status(201).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
