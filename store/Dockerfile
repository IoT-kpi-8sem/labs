FROM public.ecr.aws/docker/library/node:lts-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci --force
RUN npm run build

FROM public.ecr.aws/docker/library/node:lts-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

RUN npm ci --force

CMD [ "npm", "run", "start:prod" ]