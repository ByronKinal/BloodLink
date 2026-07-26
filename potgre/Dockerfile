FROM node:22-alpine

WORKDIR /app

# Enable pnpm 10
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# Copy dependencies manifest
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy application source code
COPY . .

EXPOSE 3007

CMD ["node", "index.js"]
