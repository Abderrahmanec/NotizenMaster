# Build stage
FROM maven:3.8.8-eclipse-temurin-17 as build

WORKDIR /app

# Copy pom.xml first to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar backend.jar

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "backend.jar"]