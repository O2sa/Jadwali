# Stage 1: Build server and workspace dependencies
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/school-timetabling-engine ./packages/school-timetabling-engine
COPY server ./server

RUN pnpm install --frozen-lockfile
RUN pnpm --filter school-timetabling-engine build
RUN pnpm --filter server build
RUN pnpm --filter server --prod deploy /app/deployed

# Stage 2: Production Node.js runtime
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/deployed ./

USER node
EXPOSE 6666

CMD ["node", "dist/index.js"]
