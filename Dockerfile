# 1. build the app
FROM oven/bun:1.1.36-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

#2. run the app
FROM oven/bun:1.1.36-alpine

WORKDIR /app

COPY --from=builder /app/build ./build

COPY package.json bun.lockb ./
RUN bun install

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]
