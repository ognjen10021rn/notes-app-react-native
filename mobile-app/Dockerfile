# ========= BASE STAGE =========
FROM node:18-bullseye AS base

# Install dependencies for Android tools (optional if you just want Metro)
RUN apt-get update && apt-get install -y openjdk-17-jdk wget unzip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ========= DEV STAGE =========
FROM base AS dev

EXPOSE 8081

CMD ["npm", "start"]

# ========= PROD STAGE =========
FROM base AS prod

RUN cd android && ./gradlew assembleRelease
CMD ["ls", "-lh", "android/app/build/outputs/apk/release"]

