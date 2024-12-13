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
FROM node:22

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

COPY package.json bun.lockb ./
RUN npm i -g bun

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]
