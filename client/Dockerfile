# Stage 1: Build client and dependencies
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/school-timetabling-engine ./packages/school-timetabling-engine
COPY client ./client

RUN pnpm install --frozen-lockfile
RUN pnpm --filter school-timetabling-engine build
ENV VITE_BASE_PATH=/
RUN pnpm --filter client build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runner

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
