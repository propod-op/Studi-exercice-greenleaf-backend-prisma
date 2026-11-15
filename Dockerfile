FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# A l'installation et figé
RUN npm ci   
COPY . .
EXPOSE 3000
# AAu démarrage du conteneur (je crois)
CMD ["node", "./src/index.js"]