FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install

RUN bunx turbo build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
