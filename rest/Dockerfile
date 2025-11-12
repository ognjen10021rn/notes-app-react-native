# ---------- 1. dependencies ----------
FROM maven:3-eclipse-temurin-17-alpine AS deps
WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

# ---------- 2. build ----------
FROM maven:3-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY --from=deps /root/.m2 /root/.m2
COPY . .
RUN mvn -B package -DskipTests

# ---------- 3. dev (hot reload) ----------
FROM maven:3-eclipse-temurin-17-alpine AS dev
WORKDIR /app
COPY --from=deps /root/.m2 /root/.m2

# install inotify-tools for file watching
RUN apk add --no-cache inotify-tools

# copy the entrypoint script (added below)
COPY ./docker/images/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]

# ---------- 4. production ----------
FROM eclipse-temurin:17-jdk-alpine AS release
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN addgroup --system app && adduser -S -G app app
USER app

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
