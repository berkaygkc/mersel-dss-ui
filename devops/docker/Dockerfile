# Multi-stage Dockerfile for Sign UI (React + Vite)
# Stage 1: Build
FROM node:18-alpine AS builder


LABEL maintainer="Mersel <info@mersel.io>"
LABEL description="Mersel DSS Sign UI - React Build Stage"

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

ARG VITE_SIGN_API_URL
ARG VITE_VERIFY_API_URL

# Set environment variables
ENV VITE_SIGN_API_URL=${VITE_SIGN_API_URL}
ENV VITE_VERIFY_API_URL=${VITE_VERIFY_API_URL}

# Build application
RUN yarn build

# Stage 2: Production with Nginx
FROM nginx:1.25-alpine

LABEL maintainer="Mersel <info@mersel.io>"
LABEL description="Mersel DSS Sign UI - Modern Web Interface"
LABEL version="0.1.0"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY devops/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY devops/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port (8080 for non-root user)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

