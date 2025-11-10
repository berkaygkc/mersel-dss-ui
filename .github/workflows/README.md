# GitHub Actions Workflows

## Docker Build and Push

Bu workflow, sign-ui projesini otomatik olarak derler ve Docker Hub'a yükler.

### Tetiklenme Koşulları

Workflow aşağıdaki durumlarda otomatik olarak çalışır:

1. **Push Events:**
   - `main` branch'e push
   - `develop` branch'e push
   - Version tag'i (örn: `v1.0.0`) push edildiğinde

2. **Pull Request:**
   - `main` branch'e PR açıldığında (sadece build, push yok)

3. **Manuel Tetikleme:**
   - GitHub Actions sekmesinden "Run workflow" ile manuel olarak çalıştırılabilir

### Gerekli GitHub Secrets

Workflow'un çalışması için aşağıdaki secrets'ların repository settings'de veya organization level'da tanımlanması gerekir:

1. **DOCKERHUB_USERNAME**: Docker Hub kullanıcı adınız
2. **DOCKERHUB_TOKEN**: Docker Hub access token'ınız

#### Docker Hub Token Oluşturma

1. Docker Hub'a giriş yapın
2. Account Settings > Security > New Access Token
3. Token'a bir isim verin (örn: "GitHub Actions")
4. "Read, Write, Delete" yetkilerini seçin
5. Generate edilen token'ı kopyalayın

#### GitHub Secrets Ekleme

**Repository Level:**
1. GitHub repository'nizde Settings > Secrets and variables > Actions
2. "New repository secret" butonuna tıklayın

**Organization Level (Önerilen):**
1. GitHub Organization Settings > Secrets and variables > Actions
2. "New organization secret" butonuna tıklayın
3. Repository access: "All repositories" veya spesifik repo'lar seçin

Her bir secret için:
```
Name: DOCKERHUB_USERNAME
Value: [Docker Hub kullanıcı adınız]

Name: DOCKERHUB_TOKEN
Value: [Yukarıda oluşturduğunuz token]
```

### Docker Image Tag Stratejisi

Workflow otomatik olarak aşağıdaki tag'leri oluşturur:

- `latest`: Main branch'ten build edildiğinde
- `develop`: Develop branch'ten build edildiğinde
- `v1.0.0`: Version tag'i push edildiğinde
- `1.0`: Minor version tag
- `1`: Major version tag
- `main-abc1234`: Branch adı ve commit SHA

### Kullanım Örnekleri

#### 1. Development Build

```bash
# Develop branch'e push
git checkout develop
git add .
git commit -m "feat: yeni özellik"
git push origin develop
```

Bu `mersel/dss-sign-ui:develop` image'ini oluşturur.

#### 2. Production Release

```bash
# Main branch'e merge
git checkout main
git merge develop
git push origin main

# Version tag ekle
git tag v1.0.0
git push origin v1.0.0
```

Bu aşağıdaki image'leri oluşturur:
- `mersel/dss-sign-ui:latest`
- `mersel/dss-sign-ui:v1.0.0`
- `mersel/dss-sign-ui:1.0`
- `mersel/dss-sign-ui:1`

#### 3. Manuel Çalıştırma

1. GitHub repository'de Actions sekmesine gidin
2. "Build and Push Sign UI Docker Image" workflow'unu seçin
3. "Run workflow" butonuna tıklayın
4. Branch seçin ve "Run workflow" ile başlatın

### Docker Image Kullanımı

Build edilen image'leri çekmek için:

```bash
# Latest version
docker pull mersel/dss-sign-ui:latest

# Specific version
docker pull mersel/dss-sign-ui:v1.0.0

# Development version
docker pull mersel/dss-sign-ui:develop

# Run
docker run -d -p 3001:8080 mersel/dss-sign-ui:latest
```

### Workflow Özellikleri

- ✅ Node.js 18 with Yarn caching
- ✅ Type checking (TypeScript)
- ✅ Build artifacts upload
- ✅ Multi-architecture build (linux/amd64, linux/arm64)
- ✅ Docker layer caching
- ✅ Docker Hub README sync
- ✅ Semantic versioning support

### Workflow Adımları

1. **Checkout code**: Code'u çeker
2. **Setup Node.js**: Node 18 + Yarn cache
3. **Install dependencies**: `yarn install --frozen-lockfile`
4. **Build application**: `yarn build`
5. **Type check**: `yarn tsc --noEmit`
6. **Upload artifacts**: dist/ klasörünü artifact olarak saklar
7. **Docker setup**: Buildx kurulumu
8. **Docker login**: Docker Hub'a login
9. **Extract metadata**: Tag'leri ve label'ları oluşturur
10. **Build & Push**: Image'i build ve push eder
11. **Update README**: Docker Hub README'yi günceller

### Troubleshooting

#### Build Başarısız Oluyor

1. **Actions sekmesinde failed workflow'u kontrol edin**
   - Repository > Actions
   - Failed workflow'u tıklayın
   - Step loglarını inceleyin

2. **Common Issues:**
   ```bash
   # Type error
   - yarn tsc --noEmit çalıştırın
   - TypeScript hatalarını düzeltin
   
   # Build error
   - yarn build locally test edin
   - Dependencies eksik olabilir
   
   # Docker build error
   - Dockerfile syntax kontrol
   - .dockerignore kontrol
   ```

#### Docker Hub'a Push Yapamıyor

1. **Secrets'ları kontrol edin**
   - Settings > Secrets and variables > Actions
   - DOCKERHUB_USERNAME ve DOCKERHUB_TOKEN var mı?
   - Token süresi dolmamış mı?

2. **Token yetkilerini kontrol edin**
   - Token "Write" yetkisine sahip mi?
   - Docker Hub'da repository oluşturulmuş mu?

#### Image Çekilemiyor

1. **Docker Hub'da image'i kontrol edin**
   - https://hub.docker.com/r/mersel/dss-sign-ui
   - Image public mi?

2. **Doğru tag'i kullanın**
   ```bash
   docker pull mersel/dss-sign-ui:latest
   ```

### Best Practices

1. **Version Tags**: Semantic versioning kullanın (v1.0.0, v1.1.0, vs.)
2. **Commit Messages**: Conventional commits kullanın (feat:, fix:, vs.)
3. **Testing**: Main branch'e merge öncesi PR açın ve build'in geçmesini bekleyin
4. **Security**: Token'larınızı asla code'a commit etmeyin
5. **Environment Variables**: API URL gibi değerleri build time'da doğru ayarlayın

### Performance

- **Yarn cache**: Dependencies bir kere indirilir
- **Docker layer cache**: Değişmeyen layer'lar cache'lenir
- **Multi-stage build**: Final image minimal boyutta (~50MB)
- **Parallel builds**: Multi-architecture build parallel yapılır

### Monitoring

```bash
# Workflow durumu
gh run list --workflow=docker-publish.yml

# Son workflow'u izle
gh run watch

# Logs
gh run view --log
```

## 📚 Kaynaklar

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Main README](../README.md)
- [Docker Deployment Guide](../devops/docker/README.md)

---

**CI/CD made easy!** 🚀

