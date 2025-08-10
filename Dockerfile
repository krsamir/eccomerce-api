FROM node:22-alpine

WORKDIR /app

# 2️⃣ Install dependencies
# Copy root manifests
COPY package.json yarn.lock ./

# Copy workspace manifests (for caching)
COPY utils/package.json ./utils/
COPY server/package.json ./server/
COPY datasource/package.json ./datasource/
COPY mail/package.json ./mail/

# Install deps (workspace-aware)
RUN yarn install --frozen-lockfile

# 3️⃣ Copy source code
COPY . .

# 4️⃣ Set default workspace and command
WORKDIR /app/server
CMD ["node", "index.js"]
