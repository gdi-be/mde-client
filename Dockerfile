# 1. build the app
FROM node:22 AS builder

WORKDIR /app

COPY . .
COPY .env.example .env
COPY .npmrc .npmrc
RUN npm i -g bun
RUN bun install --frozen-lockfile
RUN bun run build

# 2. run the app
FROM oven/bun:1.1.36-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]
