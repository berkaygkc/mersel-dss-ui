# Sign API - Frontend Kurulum ve Kullanım

## ✅ Kurulum Tamamlandı!

Modern, responsive dijital imza yönetim arayüzü başarıyla kuruldu.

## 🎯 Kurulum Özeti

### Yüklenen Teknolojiler
- ✅ React 18 + TypeScript
- ✅ Vite 5 (Build Tool & Dev Server)
- ✅ Tailwind CSS 3 (Styling)
- ✅ shadcn/ui (UI Components - Resmi CLI ile kuruldu)
- ✅ React Router 6 (Routing)
- ✅ TanStack Query v5 (API State Management)
- ✅ Axios (HTTP Client)
- ✅ Lucide React (Icons)

### Oluşturulan Yapı

```
sign-ui/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (7 component)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   └── alert.tsx
│   │   └── layout/          # Layout components
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── main-layout.tsx
│   ├── pages/               # 7 Sayfa
│   │   ├── dashboard.tsx
│   │   ├── pdf-sign.tsx
│   │   ├── xml-sign.tsx
│   │   ├── soap-sign.tsx
│   │   ├── timestamp.tsx
│   │   ├── tubitak.tsx
│   │   └── certificates.tsx
│   ├── hooks/               # Custom React Hooks
│   │   ├── use-sign.ts      # PDF, XML, SOAP imzalama hooks
│   │   ├── use-timestamp.ts # Timestamp hooks
│   │   └── use-certificates.ts # Sertifika & kontör hooks
│   ├── lib/
│   │   ├── api-client.ts    # Axios client & API methods
│   │   ├── query-client.ts  # TanStack Query config
│   │   └── utils.ts         # Helper functions (cn)
│   ├── App.tsx              # Router & Provider setup
│   └── main.tsx             # Entry point
├── components.json          # shadcn/ui config
├── tailwind.config.js       # Tailwind config (shadcn themed)
├── tsconfig.json            # TypeScript config (path aliases)
└── vite.config.ts           # Vite config (proxy setup)
```

## 🚀 Çalıştırma

### Development Server
```bash
cd /Users/erdembas/Desktop/untitled\ folder/sign-ui
yarn dev
```

Frontend: http://localhost:5173

### Backend API
```bash
cd /Users/erdembas/Desktop/untitled\ folder/sign-api
./mvnw spring-boot:run
```

Backend: http://localhost:8085

## 📱 Özellikler

### 1. Dashboard
- Sistem durumu (Sertifikalar, Timestamp, Kontör)
- Hızlı erişim kartları
- Sistem bilgileri

### 2. PDF İmzalama (PAdES)
- PDF dosya yükleme
- Base64 manuel input
- İmza seviyeleri: B, T, LT, LTA
- İmzalı PDF indirme

### 3. XML İmzalama (XAdES)
- XML dosya yükleme (e-Fatura, e-Arşiv)
- Örnek şablon yükleme
- İmza seviyeleri: B, T, LT, LTA
- İmzalı XML indirme

### 4. SOAP İmzalama (WS-Security)
- SOAP 1.1 & 1.2 desteği
- Timestamp opsiyonu
- Örnek SOAP mesajları
- İmzalı SOAP indirme

### 5. Timestamp
- Zaman damgası alma
- Zaman damgası doğrulama
- Servis durum kontrolü

### 6. TÜBİTAK Kontör
- Kontör sorgulama
- Otomatik yenileme (her 1 dakika)
- Manuel yenileme

### 7. Sertifikalar
- Keystore bilgileri
- Sertifika listesi
- Geçerlilik kontrolü
- Detaylı sertifika bilgileri

## 🎨 UI/UX Özellikleri

- ✅ Modern, temiz tasarım
- ✅ Responsive (Mobil, Tablet, Desktop)
- ✅ Dark mode hazır (shadcn/ui)
- ✅ Loading states
- ✅ Error handling
- ✅ Success/Error alerts
- ✅ Real-time data updates
- ✅ Intuitive navigation
- ✅ Consistent design system

## 🔌 API Entegrasyonu

### Endpoint'ler
- `POST /v1/padessign` - PDF imzalama
- `POST /v1/xadessign` - XML imzalama
- `POST /v1/wssecuritysign` - SOAP imzalama
- `POST /api/timestamp/get` - Timestamp alma
- `POST /api/timestamp/validate` - Timestamp doğrulama
- `GET /api/timestamp/status` - Timestamp durumu
- `GET /api/tubitak/credit` - TÜBİTAK kontör
- `GET /api/certificates/list` - Sertifika listesi
- `GET /api/certificates/info` - Keystore bilgisi

### API Client
- Type-safe TypeScript interfaces
- Axios interceptors
- Error handling
- Base URL configuration

### TanStack Query
- Otomatik caching (5 dakika)
- Background refetch
- Mutation state management
- DevTools entegrasyonu

## 🛠️ Geliştirme

### Component Ekleme (shadcn/ui)
```bash
npx shadcn@latest add [component-name]
```

### Build
```bash
yarn build
```

### Preview Production Build
```bash
yarn preview
```

## 📝 Notlar

- Vite proxy: `/api` → `http://localhost:8085`
- Path alias: `@/*` → `./src/*`
- TanStack Query DevTools otomatik eklendi
- shadcn/ui resmi CLI ile kuruldu
- Tailwind CSS 3 (shadcn default theme)

## 🎯 Yapılabilecekler (İsteğe Bağlı)

- [ ] Dark mode toggle ekle
- [ ] i18n (Türkçe/İngilizce) desteği
- [ ] Dosya sürükle-bırak
- [ ] Toplu imzalama
- [ ] İmza geçmişi
- [ ] Kullanıcı yönetimi / Auth
- [ ] PDF preview
- [ ] XML syntax highlighting
- [ ] Export/Import ayarlar

## ✨ Önemli

Backend API'nin `http://localhost:8085` adresinde çalışıyor olması gerekir.

Backend başlatma:
```bash
cd sign-api
./mvnw spring-boot:run
```

---

**Hazırlayan:** AI Assistant  
**Tarih:** 2025-11-07  
**Versiyon:** 0.1.0

