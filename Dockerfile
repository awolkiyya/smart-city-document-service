# ================================
# 1. Base image (Node)
# ================================
FROM node:20-slim

# ================================
# 2. Install system dependencies
# (LibreOffice + fonts + pdf tools)
# ================================
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-common \
    fonts-dejavu \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# ================================
# 3. Set working directory
# ================================
WORKDIR /app

# ================================
# 4. Copy package files
# ================================
COPY package*.json ./

# ================================
# 5. Install dependencies
# ================================
RUN npm install

# ================================
# 6. Copy source code
# ================================
COPY . .

# ================================
# 7. Build TypeScript
# ================================
RUN npm run build

# ================================
# 8. Create runtime folders
# ================================
RUN mkdir -p /tmp/generated

# ================================
# 9. Expose port
# ================================
EXPOSE 3000

# ================================
# 10. Start server
# ================================
CMD ["npm", "start"]