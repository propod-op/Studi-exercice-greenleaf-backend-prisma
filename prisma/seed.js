import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.service.deleteMany();

  await prisma.service.createMany({
    data: [
      {
        nom: "Création de jardin",
        description:
          "Conception et aménagement complet de votre espace extérieur.",
        prix: 1200,
      },
      {
        nom: "Entretien mensuel",
        description: "Tonte, désherbage et entretien des massifs.",
        prix: 90,
      },
      {
        nom: "Taille de haies",
        description: "Taille et évacuation des déchets verts.",
        prix: 150,
      },
      {
        nom: "Arrosage automatique",
        description: "Installation d'un système d'arrosage programmable.",
        prix: 650,
      },
    ],
  });

  console.log("Seed terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
