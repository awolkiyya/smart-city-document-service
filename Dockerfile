# =========================================================
# 1. Builder Stage (TypeScript compilation)
# =========================================================
FROM node:20.11-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# =========================================================
# 2. Runtime Stage (Production Image)
# =========================================================
FROM node:20.11-bullseye-slim

# =========================================================
# Environment
# =========================================================
ENV NODE_ENV=production
ENV PORT=3000
ENV LIBREOFFICE_PATH=/usr/bin/soffice

# =========================================================
# System dependencies
# =========================================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-core \
    libreoffice-writer \
    fonts-dejavu \
    fontconfig \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# =========================================================
# Non-root user (security)
# =========================================================
RUN useradd -m appuser

WORKDIR /app

# =========================================================
# Install production dependencies only
# =========================================================
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# =========================================================
# Application files
# =========================================================
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
COPY --from=builder --chown=appuser:appuser /app/templates ./templates
COPY --from=builder --chown=appuser:appuser /app/assets ./assets

# =========================================================
# Persistent runtime directories (IMPORTANT FIX)
# =========================================================
RUN mkdir -p \
    /app/storage \
    /app/generated \
    /app/tmp \
    && chown -R appuser:appuser /app/storage /app/generated /app/tmp

# =========================================================
# Switch to non-root user
# =========================================================
USER appuser

# =========================================================
# Port
# =========================================================
EXPOSE 3000

# =========================================================
# Healthcheck
# =========================================================
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
CMD curl -fsS http://localhost:3000/health || exit 1

# =========================================================
# Start app
# =========================================================
CMD ["node", "dist/server.js"]