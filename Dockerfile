# 1. build the app
FROM node:22 AS builder

WORKDIR /app

COPY . .
COPY .env.example .env
RUN npm i -g bun
RUN bun install --frozen-lockfile
RUN bun run build

# 2. run the app
FROM oven/bun:1.1.36-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

COPY .env.example .env
COPY package.json bun.lock ./

# Unfortunately the svelte-adapter-bun does't allow to set the idle timeout.
RUN sed -i "s/serverOptions = {/serverOptions = {\n  idleTimeout: 255,/g" ./build/index.js

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]
