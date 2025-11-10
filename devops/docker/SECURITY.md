# 🔐 Docker Security

Sign UI Docker image'inin güvenlik yapılandırması.

## Non-Root User

Container **non-root user** (`nginx`) olarak çalışır.

### Port Konfigürasyonu

```
Container Port: 8080 (non-privileged)
Host Port: 3001 (mapped)
```

**Neden Port 8080?**

- Port 80 **privileged port** (root gerektirir)
- Port 1024+ **non-privileged** (normal user kullanabilir)
- Security best practice: Non-root user ile çalışma

### Port Mapping

```bash
# docker-compose.yml
ports:
  - "3001:8080"  # Host:Container
  
# docker run
docker run -d -p 3001:8080 sign-ui
```

**Host'tan erişim**: http://localhost:3001 (otomatik olarak container'daki 8080'e map edilir)

## Security Best Practices

### ✅ Implemented

1. **Non-root user**: Container nginx user olarak çalışır
2. **Unprivileged port**: 8080 (1024+)
3. **Read-only filesystem**: Static files için
4. **Security headers**: X-Frame-Options, CSP, etc.
5. **Minimal base image**: Alpine Linux (~50MB)
6. **No unnecessary packages**: Sadece gerekli paketler
7. **Health checks**: Liveness ve readiness probe

### 🔒 Nginx Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 🌐 CORS

Vite build zamanında API URL embed edilir, runtime CORS yapılandırması backend'de (Sign API) yapılmalı.

## Production Deployment

### SSL/TLS with Reverse Proxy

Production'da nginx-proxy servisi ile SSL termination:

```bash
# Production profile ile
docker-compose --profile production up -d
```

nginx-proxy:
- ✅ Port 80/443'e bind edilebilir (root olarak çalışır)
- ✅ SSL/TLS termination
- ✅ HTTP → HTTPS redirect
- ✅ sign-ui'ye internal olarak proxy (8080)

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: sign-ui
spec:
  ports:
  - port: 80        # Service port
    targetPort: 8080  # Container port
  selector:
    app: sign-ui
```

## Security Scanning

### Vulnerability Scan

```bash
# Trivy ile scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image yourusername/dss-sign-ui:latest

# Snyk ile scan
snyk container test yourusername/dss-sign-ui:latest
```

### Best Practices Check

```bash
# Hadolint ile Dockerfile check
docker run --rm -i hadolint/hadolint < devops/docker/Dockerfile

# Dockle ile image check
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  goodwithtech/dockle yourusername/dss-sign-ui:latest
```

## Runtime Security

### 1. Resource Limits

```yaml
# docker-compose.yml
services:
  sign-ui:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

### 2. Read-only Root Filesystem

```yaml
services:
  sign-ui:
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
      - /var/run
```

### 3. Drop Capabilities

```yaml
services:
  sign-ui:
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
```

## Compliance

- ✅ **CIS Docker Benchmark**: Non-root user, minimal image
- ✅ **OWASP Top 10**: Security headers, CSP
- ✅ **PCI-DSS**: Secure configuration, logging

## Monitoring

### Container Security Events

```bash
# Docker events
docker events --filter 'type=container' --filter 'container=sign-ui'

# Falco (advanced)
# Runtime security monitoring
```

## Updates

### Image Updates

```bash
# Check for updates
docker pull nginx:1.25-alpine
docker pull node:18-alpine

# Rebuild
docker-compose build --no-cache sign-ui
```

### Security Patches

```bash
# Auto-update base images (GitHub Actions)
# Dependabot ile otomatik PR'lar
```

## Incident Response

### Container Compromise

```bash
# 1. Stop container
docker-compose stop sign-ui

# 2. Inspect
docker inspect sign-ui
docker logs sign-ui

# 3. Remove
docker-compose down

# 4. Clean rebuild
docker-compose build --no-cache sign-ui
docker-compose up -d
```

## References

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

---

**Security first!** 🔒

