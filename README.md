## Installation

1. Télécharger le repository
2. Installer les dépendances : `npm i`
3. copier : `.env, .gitignore`
4. Charger une base Postgresql et s'assurer de la configuartion de la base dans le `.env`
5. Vérifier la version de Prisma et le schéma

   ```npx prisma -v
   npx prisma validate
   ```

   validate vérifie la syntaxe du schema.prisma et que DATABASE_URL est bien lue. La version compte : avec Prisma 7, la config passe par un fichier prisma.config.ts et le .env n’est plus chargé automatiquement (il faut import "dotenv/config" dans ce fichier). C’est une source classique de « Environment variable not found » après un clone.

6. Si le dossier prisma/migrations/ existe (cas le plus courant) :
   Créer les tables : `npx prisma migrate dev`
   Cette commande rejoue l’historique des migrations sur ta base vide, puis lance generate, et le seed s’il est configuré. En dev, elle crée une « shadow database » temporaire, donc l’utilisateur Postgres doit avoir le droit CREATEDB. C’est le cas avec le superuser par défaut de l’image Docker. Pour un environnement de prod ou de CI, on utilise plutôt npx prisma migrate deploy, qui applique les migrations existantes sans rien créer de nouveau.

   Si le dossier migrations/ n’existe pas, le schéma est seulement décrit dans schema.prisma : `npx prisma db push`

7. Générer le client Prisma : `npx prisma generate`
8. Peupler la base (si un seed existe) : `npx prisma db seed`
9. Lancer le studio : `npx prisma studio`
