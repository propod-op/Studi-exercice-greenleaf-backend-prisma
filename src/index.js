import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import servicesRouter from "./routes/services.js";
import utilisateursRouter from "./routes/utilisateurs.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Plusieurs origines possibles, séparées par des virgules
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check : utilisé par Render/Railway pour savoir si l'API est vivante
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "ok" });
  } catch {
    res.status(503).json({ status: "error", db: "unreachable" });
  }
});

app.use("/api/services", servicesRouter);
app.use("/api/utilisateurs", utilisateursRouter);

app.listen(PORT, () => {
  console.log(`API Greenleaf démarrée sur le port ${PORT}`);
});
