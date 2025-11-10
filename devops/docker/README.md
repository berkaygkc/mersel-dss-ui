# 🐳 Docker Deployment

Sign UI Docker yapılandırma dosyaları.

## 📁 İçerik

```
devops/docker/
├── Dockerfile              # Multi-stage Docker image
├── docker-compose.yml      # Service orchestration
├── .dockerignore          # Build optimization
├── env.example            # Environment template
├── nginx/
│   ├── nginx.conf         # Main nginx config
│   └── default.conf       # Server block config
├── unix/                  # Unix helper scripts
│   └── start.sh
├── windows/               # Windows helper scripts
│   └── start.ps1
└── README.md
```

## 🚀 Hızlı Başlangıç

### Basit Başlatma (UI Only)

```bash
# Bu dizine git
cd devops/docker

# Direkt başlat
docker-compose up -d
```

### Backend ile Birlikte

```bash
# Backend API ile birlikte
docker-compose --profile with-backend up -d
```

## 🌐 Endpoint'ler

| Service | URL | Description |
|---------|-----|-------------|
| Sign UI | http://localhost:3001 | React web interface |
| Health | http://localhost:3001/health | Health check |
| Sign API | http://localhost:8085 | Backend API (with-backend profile) |

## 🔧 Servisler

### Sign UI

```bash
# Başlat
docker-compose up -d sign-ui

# Log'ları izle
docker-compose logs -f sign-ui

# Restart
docker-compose restart sign-ui

# Durdur
docker-compose stop sign-ui

# Sil
docker-compose down
```

### Backend ile Birlikte

```bash
# Backend API dahil başlat
docker-compose --profile with-backend up -d

# Sadece UI
docker-compose up -d sign-ui
```

## 🛠️ Helper Scripts

### Unix/Linux/macOS

```bash
chmod +x unix/start.sh
./unix/start.sh
```

### Windows (PowerShell)

```powershell
.\windows\start.ps1
```

## 🧪 Build ve Test

### Local Build

```bash
# Build image
docker build -t sign-ui:local -f Dockerfile ../..

# Run
docker run -d -p 3001:80 --name sign-ui sign-ui:local

# Test
curl http://localhost:3001/health
```

### Production Build

```bash
# Build with API URL
docker build \
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com \
  -t sign-ui:production \
  -f Dockerfile ../..
```

## 📦 Environment Variables

### Build Time

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | http://localhost:8085 | Backend API URL |

### Runtime

Vite build zamanında environment variables embed edilir. Runtime'da değiştirilemez.

## 🔍 Debugging

### Container'a Gir

```bash
# Shell aç
docker-compose exec sign-ui sh

# Nginx config kontrol
docker-compose exec sign-ui cat /etc/nginx/conf.d/default.conf

# Logs
docker-compose exec sign-ui cat /var/log/nginx/access.log
```

### Build Logs

```bash
# Build with progress
docker-compose build --progress=plain sign-ui

# No cache build
docker-compose build --no-cache sign-ui
```

## 🔄 Güncelleme

### Image Güncelleme

```bash
# Rebuild
docker-compose build sign-ui

# Restart
docker-compose up -d sign-ui

# Veya tek komutla
docker-compose up -d --build sign-ui
```

### Yeni Version Deploy

```bash
# Pull latest
docker pull yourusername/dss-sign-ui:latest

# Recreate
docker-compose up -d
```

## 📝 Nginx Yapılandırması

### SPA Routing

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

React Router için tüm route'lar index.html'e yönlendirilir.

### Cache Stratejisi

- **index.html**: No cache (her zaman fresh)
- **Static assets**: 1 year cache (immutable)

### API Proxy (Opsiyonel)

```nginx
location /api/ {
    proxy_pass http://sign-api:8085;
    # ... proxy settings
}
```

## 🔐 Production Deployment

### 1. Environment Hazırlığı

```bash
# .env dosyası oluştur
cat > .env << EOF
VITE_API_BASE_URL=https://api.yourdomain.com
DOCKERHUB_USERNAME=yourusername
EOF
```

### 2. SSL/TLS Setup

```bash
# SSL sertifikalarını yerleştir
mkdir -p ssl
cp your-cert.pem ssl/
cp your-key.pem ssl/

# Production profile ile başlat
docker-compose --profile production up -d
```

### 3. Reverse Proxy

Nginx reverse proxy configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://sign-ui:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🎨 Customization

### Custom Nginx Config

```bash
# Edit config
nano nginx/default.conf

# Reload nginx
docker-compose exec sign-ui nginx -s reload
```

### API URL Değiştirme

Build zamanında:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://new-api.com \
  -t sign-ui:custom .
```

## 🔍 Troubleshooting

### UI Açılmıyor

```bash
# Container durumu
docker-compose ps

# Logs
docker-compose logs sign-ui

# Health check
curl http://localhost:3001/health
```

### Nginx Hataları

```bash
# Config test
docker-compose exec sign-ui nginx -t

# Error logs
docker-compose exec sign-ui cat /var/log/nginx/error.log
```

### API Bağlantı Sorunu

```bash
# Network kontrol
docker-compose exec sign-ui ping sign-api

# API endpoint test
curl http://localhost:8085/actuator/health
```

## 📊 Monitoring (Opsiyonel)

### Access Logs

```bash
# Real-time
docker-compose logs -f sign-ui

# Last 100 lines
docker-compose logs --tail=100 sign-ui
```

### Resource Usage

```bash
# Stats
docker stats sign-ui

# Detailed info
docker inspect sign-ui
```

## 🚀 CI/CD Integration

GitHub Actions otomatik olarak:
1. ✅ Dependencies install
2. ✅ Build application
3. ✅ Type check
4. ✅ Build Docker image
5. ✅ Push to Docker Hub

Workflow: [../../.github/workflows/docker-publish.yml](../../.github/workflows/docker-publish.yml)

## 📚 Kaynaklar

- [Main README](../../README.md)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Kolay deployment için Docker!** 🐳

