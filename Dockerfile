FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production && npm cache clean --force

COPY build ./build

RUN addgroup -g 1001 -S nodejs && adduser -S reactapp -u 1001

USER reactapp

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
