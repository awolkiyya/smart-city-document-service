# ================================
# 1. Base image
# ================================
FROM node:20-slim

# ================================
# 2. Set environment
# ================================
ENV NODE_ENV=production
ENV PORT=3000

# ================================
# 3. Install system dependencies
# ================================
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-common \
    fonts-dejavu \
    fontconfig \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ================================
# 4. Create app user (security best practice)
# ================================
RUN useradd -m appuser

# ================================
# 5. Set working directory
# ================================
WORKDIR /app

# ================================
# 6. Copy dependency files first (better caching)
# ================================
COPY package*.json ./

# ================================
# 7. Install dependencies (production only)
# ================================
RUN npm ci --omit=dev

# ================================
# 8. Copy source code
# ================================
COPY . .

# ================================
# 9. Build TypeScript
# ================================
RUN npm run build

# ================================
# 10. Create runtime folders
# ================================
RUN mkdir -p /tmp/generated && chown -R appuser:appuser /tmp/generated

# ================================
# 11. Switch to non-root user
# ================================
USER appuser

# ================================
# 12. Expose port
# ================================
EXPOSE 3000

# ================================
# 13. Start server
# ================================
CMD ["node", "dist/server.js"]