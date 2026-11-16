#------ COUCHE USERLAND --------
FROM node:22-alpine AS base
WORKDIR /app
# Requis par le moteur Rust de Prisma sur Alpine (musl)
RUN apk add --no-cache openssl

#------ COUCHE DEPENDANCES (dev incluses) --------
FROM base AS deps
COPY package*.json ./
# A l'installation et figé
RUN npm ci

#------ COUCHE BUILDER ----------
FROM deps AS builder
COPY . .
# RUN npx prisma generate
RUN npm run build

#------ DEPENDANCES DE PROD (sans devDependencies) --------
FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev

#------ COUCHE RUNNER (prod.) --------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000

COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
# Client Prisma généré : à copier APRÈS node_modules, il s'y superpose
COPY --chown=node:node --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node package*.json ./

USER node
EXPOSE 4000
CMD ["node", "src/index.js"]