#!/bin/sh

echo "🚀 Starting Spring Boot Dev Container with Hot Reload..."

# Watch for file changes and recompile in background
while inotifywait -r -e modify,create,delete /app/src/main/; do
  echo "🔁 Detected changes — recompiling..."
  mvn compile -DskipTests -o
done >/dev/null 2>&1 &

# Run Spring Boot application
mvn spring-boot:run
