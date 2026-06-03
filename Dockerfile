# 1. Base da imagem com Node.js
FROM node:20-alpine AS base

# 2. Instalação das dependências
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Build do projeto Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 4. Imagem final de produção (leve e limpa)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia apenas o necessário do estágio de build para a imagem final
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]