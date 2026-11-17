#------ COUCHE USERLAND --------
# Socle commun : Node 22 + Alpine, dossier de travail, openssl pour Prisma

FROM node:22-alpine AS base
# Il faut créer un utilisateur non-root pour protéger des remontées 
# de privilèges (ex: npm audit fix)
# alpine comprend déjà l'utlisateur node:node
# donc pas besoin de : RUN addgroup -S appgroup && adduser -S -H -u 1001 -G appgroup appuser
WORKDIR /app
# Requis par le moteur Rust de Prisma sur Alpine (musl) pour la version de binaire
RUN apk add --no-cache openssl

#------ COUCHE DEPENDANCES (dev incluses) --------
# Installation figée (npm ci) de toutes les dépendances, nécessaires au build

FROM base AS deps
COPY package*.json ./
# A l'installation et figé
RUN npm ci

#------ COUCHE BUILDER ----------
# Copie du code source + compilation (le résultat sert au runner)
FROM deps AS builder
# n a récupéré les dépendances...
# On copie le code :  prisma, src, etc. (mais pas node_modules)
COPY . .
# RUN npx prisma generate (a voir si besoin ou pas...)
# On build :
RUN npm run build

#------ DEPENDANCES DE PROD (sans devDependencies) --------
# Installation allégée, uniquement ce dont l'appli a besoin pour tourner

FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev

#------ COUCHE RUNNER (prod.) --------
# Image finale : node_modules de prod + code buildé, exécutée en non-root (node)

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000

COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
# Client Prisma généré : à copier APRÈS node_modules, il s'y superpose
COPY --chown=node:node --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node package*.json ./

# /app est toujours en root alors on le passe en groupe:util. node:node
RUN chown node:node /app
# Le reste passe en node:node
USER node

EXPOSE 4000
CMD ["node", "src/index.js"]