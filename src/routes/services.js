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

export default router;
