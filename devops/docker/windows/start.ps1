# Sign UI Docker Compose Starter (PowerShell)
# Usage: .\start.ps1

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dockerDir = Split-Path -Parent $scriptDir

Set-Location $dockerDir

Write-Host "🚀 Starting Sign UI with Docker Compose..." -ForegroundColor Green
Write-Host "📁 Working directory: $dockerDir" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Check if docker-compose is available
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: docker-compose not found!" -ForegroundColor Red
    Write-Host "Please install docker-compose and try again." -ForegroundColor Yellow
    exit 1
}

# Pull latest images
Write-Host "📦 Pulling latest images..." -ForegroundColor Yellow
docker-compose pull

# Start services
Write-Host "🐳 Starting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check health
Write-Host ""
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
Write-Host ""

# Check Sign UI
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Sign UI is healthy!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Sign UI is not ready yet (this is normal, wait a bit)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Sign UI Started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   - Sign UI:     http://localhost:3001 (maps to container :8080)"
Write-Host "   - Health:      http://localhost:3001/health"
Write-Host ""
Write-Host "📊 Useful Commands:" -ForegroundColor Cyan
Write-Host "   - View logs:   docker-compose logs -f sign-ui"
Write-Host "   - Stop:        docker-compose stop"
Write-Host "   - Restart:     docker-compose restart"
Write-Host "   - Remove:      docker-compose down"
Write-Host ""
Write-Host "💡 To start with backend API:" -ForegroundColor Cyan
Write-Host "   docker-compose --profile with-backend up -d"
Write-Host ""

