FROM node:20-alpine AS builder

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --chown=appuser:appgroup package*.json ./

RUN npm ci

COPY --chown=appuser:appgroup . .

RUN npm run build

FROM nginx:alpine AS production

RUN apk update && apk upgrade --no-cache

COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
