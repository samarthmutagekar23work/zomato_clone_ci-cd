FROM node:20-alpine AS builder

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --chown=appuser:appgroup package*.json ./

RUN npm ci

COPY --chown=appuser:appgroup . .

RUN npm run build

RUN npm prune --production

FROM node:20-alpine AS production

RUN apk update && apk upgrade --no-cache && apk add --no-cache dumb-init

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

RUN chmod -R 755 /app

USER root

ENTRYPOINT ["dumb-init", "--"]

EXPOSE 3000

CMD ["node", "dist/server.js"]
