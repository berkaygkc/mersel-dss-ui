#!/bin/bash

# Sign UI Docker Compose Starter
# Usage: ./start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

echo "🚀 Starting Sign UI with Docker Compose..."
echo "📁 Working directory: $DOCKER_DIR"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose not found!"
    echo "Please install docker-compose and try again."
    exit 1
fi

# Pull latest images
echo "📦 Pulling latest images..."
docker-compose pull

# Start services
echo "🐳 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
echo ""
echo "🏥 Checking service health..."
echo ""

# Check Sign UI
if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Sign UI is healthy!"
else
    echo "⚠️  Sign UI is not ready yet (this is normal, wait a bit)"
fi

echo ""
echo "🎉 Sign UI Started!"
echo ""
echo "📍 Access Points:"
echo "   - Sign UI:     http://localhost:3001 (maps to container :8080)"
echo "   - Health:      http://localhost:3001/health"
echo ""
echo "📊 Useful Commands:"
echo "   - View logs:   docker-compose logs -f sign-ui"
echo "   - Stop:        docker-compose stop"
echo "   - Restart:     docker-compose restart"
echo "   - Remove:      docker-compose down"
echo ""
echo "💡 To start with backend API:"
echo "   docker-compose --profile with-backend up -d"
echo ""

