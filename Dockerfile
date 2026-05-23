# =========================================================
# 1. Builder Stage
# =========================================================
FROM node:20-slim AS builder

# =========================================================
# 2. Set working directory
# =========================================================
WORKDIR /app

# =========================================================
# 3. Install system dependencies
# =========================================================
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-common \
    fonts-dejavu \
    fontconfig \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# =========================================================
# 4. Copy package files
# =========================================================
COPY package*.json ./

# =========================================================
# 5. Install dependencies (including devDependencies)
# Needed for TypeScript build
# =========================================================
RUN npm ci

# =========================================================
# 6. Copy application source
# =========================================================
COPY . .

# =========================================================
# 7. Build TypeScript
# =========================================================
RUN npm run build

# =========================================================
# 8. Runtime Stage
# =========================================================
FROM node:20-slim

# =========================================================
# 9. Environment variables
# =========================================================
ENV NODE_ENV=production
ENV PORT=3000
ENV LIBREOFFICE_PATH=/usr/bin/soffice

# =========================================================
# 10. Install runtime system dependencies
# =========================================================
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-common \
    fonts-dejavu \
    fontconfig \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# =========================================================
# 11. Create non-root user
# =========================================================
RUN useradd -m appuser

# =========================================================
# 12. Set working directory
# =========================================================
WORKDIR /app

# =========================================================
# 13. Copy package files
# =========================================================
COPY package*.json ./

# =========================================================
# 14. Install production dependencies only
# =========================================================
RUN npm ci --omit=dev && npm cache clean --force

# =========================================================
# 15. Copy built application
# =========================================================
COPY --from=builder /app/dist ./dist

# =========================================================
# 16. Copy templates/assets if needed
# =========================================================
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/assets ./assets

# =========================================================
# 17. Create runtime directories
# =========================================================
RUN mkdir -p /tmp/generated && \
    chown -R appuser:appuser /tmp/generated /app

# =========================================================
# 18. Switch to non-root user
# =========================================================
USER appuser

# =========================================================
# 19. Expose application port
# =========================================================
EXPOSE 3000

# =========================================================
# 20. Health check
# =========================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => { if (r.status !== 200) process.exit(1) })"

# =========================================================
# 21. Start application
# =========================================================
CMD ["node", "dist/server.js"]