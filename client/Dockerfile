FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --force

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]