# ==============================================================================
# Multi-stage Dockerfile for React (Vite) Frontend
# Stage 1: Build static assets using Node.js
# ==============================================================================
FROM node:22-alpine AS build
WORKDIR /app

# Install project dependencies
COPY package*.json ./
RUN npm install

# Build production bundle
COPY . .
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ==============================================================================
# Stage 2: Serve static bundle via high-performance Nginx Alpine
# ==============================================================================
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx welcome assets
RUN rm -rf ./*

# Copy built artifacts and custom Nginx configuration
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
