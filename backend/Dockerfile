# ==============================================================================
# Multi-stage Dockerfile for Spring Boot 3 Backend (Java 17)
# Stage 1: Build JAR using Maven
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application artifact
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Stage 2: Minimal JRE Runtime
# ==============================================================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create a non-privileged application user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=build /build/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
