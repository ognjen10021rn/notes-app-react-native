# 📝 LivePad – Spring Boot Backend

**LivePad** is the backend service for a collaborative note-taking app that supports real-time updates. Built with **Spring Boot**, it provides RESTful APIs and WebSocket integration to allow users to create, update, and manage their notes with live sync functionality.

## 🚀 Features

- ✍️ Create, read, update, and delete (CRUD) notes
- 🔄 Real-time synchronization using WebSockets
- 🔐 JWT-based authentication and authorization
- 🔎 RESTful API for full note management
- 🌍 CORS enabled for frontend integration (e.g., [React Native client](https://github.com/ognjen10021rn/notes-app-react-native)
- 📅 Timestamp tracking for notes

## ⚙️ Tech Stack

- Java 17
- Spring Boot 3+
- Spring Web & Spring Security
- Spring Data JPA
- WebSocket
- PostgreSQL
- JWT (JSON Web Tokens)
- Docker (compose)

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed:

- Java 17+
- Maven
- PostgreSQL (running in a container or locally)

### Clone the Repository

```bash
git clone https://github.com/ognjen10021rn/notes-app-spring-boot.git
cd notes-app-spring-boot
```

### Configure project
Ensure your ``application.properties`` (in ``src/main/resources/``) looks like this:

```bash
spring.application.name=NotesApp
server.port=8080

# Replace your user_notes_schema with yours, and change username and password
spring.datasource.url=jdbc:postgresql://database:5432/main_database?currentSchema=user_notes_schema
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=root
spring.datasource.password=password

# Replace your user_notes_schema with yours
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.default_schema=user_notes_schema

spring.h2.console.enabled=true
```

### Run project

```bash
cd notes-app-spring-boot/docker
docker compose up -d
```
Stop project

```bash

docker compose down

```

## 📄 License

This project is licensed under the MIT License.
