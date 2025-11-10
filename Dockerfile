# Multi-stage build for React Native app
FROM node:18-alpine AS base

# Install dependencies for building
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Development stage
FROM base AS dev
RUN npm install || yarn install
COPY . .
EXPOSE 8081
CMD ["npm", "start"]

# Build stage for production
FROM base AS builder

# Install only production dependencies
RUN npm ci --production || yarn install --production --frozen-lockfile

# Copy source code
COPY . .

# Build the app (generates bundle)
RUN npm run build || npx react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output ./dist/index.android.bundle \
    --assets-dest ./dist/assets

# Production stage - serving static bundle
FROM node:18-alpine AS production

WORKDIR /app

# Install serve or http-server for serving static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000

# Serve the bundled files
CMD ["serve", "-s", "dist", "-l", "3000"]

# Production stage with Metro bundler (alternative)
FROM base AS production-metro

WORKDIR /app

# Copy production dependencies and source
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 8081

ENV NODE_ENV=production

# Start Metro bundler in production mode
CMD ["npm", "run", "start", "--", "--reset-cache"]