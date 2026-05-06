# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install

RUN bunx turbo build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
