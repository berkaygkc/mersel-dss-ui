# DevOps

Sign UI için DevOps yapılandırma dosyaları ve deployment araçları.

## 📁 Dizin Yapısı

```
devops/
├── docker/              # Docker deployment
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx/          # Nginx configs
│   ├── unix/           # Unix helper scripts
│   └── windows/        # Windows helper scripts
└── README.md
```

## 🐳 Docker Deployment

En hızlı ve kolay deployment yöntemi.

### Hızlı Başlangıç

```bash
cd devops/docker
docker-compose up -d
```

Detaylı bilgi: [docker/README.md](docker/README.md)

## 🚀 Deployment Seçenekleri

### 1. Docker Compose (Önerilen)

**Kullanım Durumu:** Development, test, production

```bash
cd devops/docker
docker-compose up -d
```

**Avantajları:**
- ✅ En hızlı setup
- ✅ Production-ready nginx
- ✅ Kolay yönetim
- ✅ Backend ile entegrasyon

### 2. Docker (Standalone)

**Kullanım Durumu:** Minimal deployment

```bash
docker run -d -p 3001:80 yourusername/dss-sign-ui:latest
```

**Avantajları:**
- ✅ Minimal resource
- ✅ Basit

### 3. Static Hosting

**Kullanım Durumu:** Serverless deployment

```bash
# Build
yarn build

# Deploy to Netlify/Vercel/S3
# dist/ klasörünü upload et
```

**Avantajları:**
- ✅ Zero server management
- ✅ Auto-scaling
- ✅ CDN

## 🛠️ Helper Scripts

### Unix/Linux/macOS

```bash
# Docker Compose ile başlat
./devops/docker/unix/start.sh
```

### Windows (PowerShell)

```powershell
# Docker Compose ile başlat
.\devops\docker\windows\start.ps1
```

## 📦 Environment Variables

Ana environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | http://localhost:8085 | Backend API URL |

Tüm environment variables için: [docker/env.example](docker/env.example)

## 🔐 Production Best Practices

### 1. Security

```bash
# HTTPS kullan
ssl_certificate /etc/nginx/ssl/cert.pem;

# Security headers (nginx'de zaten var)
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
```

### 2. Performance

```bash
# Gzip compression (enabled)
gzip on;
gzip_comp_level 6;

# Static asset caching (1 year)
expires 1y;
add_header Cache-Control "public, immutable";
```

### 3. Monitoring

```bash
# Access logs
docker-compose logs -f sign-ui

# Nginx access log
docker-compose exec sign-ui tail -f /var/log/nginx/access.log
```

### 4. Backup

```bash
# Image backup
docker save yourusername/dss-sign-ui:latest | gzip > sign-ui-backup.tar.gz

# Restore
gunzip -c sign-ui-backup.tar.gz | docker load
```

## 🔄 CI/CD

GitHub Actions workflow otomatik olarak:
1. ✅ Dependencies install
2. ✅ Build application
3. ✅ Type check
4. ✅ Docker image build
5. ✅ Docker Hub'a push

Workflow: [../.github/workflows/docker-publish.yml](../.github/workflows/docker-publish.yml)

## 📚 Kaynaklar

- [Docker Deployment Guide](docker/README.md)
- [Main README](../README.md)
- [Vite Documentation](https://vitejs.dev/)

## 💡 Sorun Giderme

### Build Hatası

```bash
# Cache'i temizle
yarn cache clean
rm -rf node_modules dist
yarn install
yarn build
```

### Docker Build Hatası

```bash
# No cache build
docker-compose build --no-cache sign-ui
```

### Port Çakışması

```bash
# Port değiştir (docker-compose.yml)
ports:
  - "3002:80"  # 3001 yerine 3002 kullan
```

### API Bağlantı Sorunu

```bash
# API URL kontrol (build time)
# Dockerfile'da VITE_API_BASE_URL değiştir ve rebuild et
docker-compose build --build-arg VITE_API_BASE_URL=http://new-api:8085 sign-ui
```

## 🆘 Yardım

Sorun mu yaşıyorsunuz?
1. [Docker README](docker/README.md)
2. [GitHub Issues](https://github.com/yourusername/sign-ui/issues)
3. [Main Documentation](../README.md)

---

**Happy Deploying!** 🚀

