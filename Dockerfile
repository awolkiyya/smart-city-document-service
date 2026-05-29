# =========================================================
# 1. Builder Stage (TypeScript compilation)
# =========================================================
FROM node:20.11-bullseye-slim AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
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
# System dependencies (optimized)
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
# Create non-root user (security hardening)
# =========================================================
RUN useradd -m appuser

WORKDIR /app

# =========================================================
# Install production dependencies only
# =========================================================
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# =========================================================
# Copy build artifacts (secure ownership)
# =========================================================
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
COPY --from=builder --chown=appuser:appuser /app/templates ./templates
COPY --from=builder --chown=appuser:appuser /app/assets ./assets

# =========================================================
# Persistent storage (documents, temp files)
# =========================================================
RUN mkdir -p /app/storage && chown -R appuser:appuser /app/storage

# Switch to non-root user
USER appuser

# =========================================================
# Expose service port
# =========================================================
EXPOSE 3000

# =========================================================
# Healthcheck (production-safe)
# =========================================================
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
CMD curl -fsS http://localhost:3000/health || exit 1

# =========================================================
# Start application
# =========================================================
CMD ["node", "dist/server.js"]