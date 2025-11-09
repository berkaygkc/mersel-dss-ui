# 🎨 Sign UI

Sign API için modern, React tabanlı web arayüzü.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan.svg)](https://tailwindcss.com/)

---

## 📚 Tam Dökümantasyon

### 👉 [Sign Platform Dökümanları](https://dss.mersel.dev) 👈

**Merkezi dökümantasyon sitesinde:**

- 📖 Detaylı kurulum ve kullanım
- 🎨 Component rehberi
- 🔌 API entegrasyonu detayları
- 💡 Kod örnekleri ve best practices
- 🔄 Güncellemeler ve changelog

---

## ⚡ Hızlı Başlangıç

```bash
# Kurulum
yarn install

# Development
yarn dev
# http://localhost:5173

# Production build
yarn build
yarn preview
```

---

## 🎯 Özellikler

- ✅ **Dijital İmzalama** - PDF (PAdES), XML (XAdES), SOAP (WS-Security)
- ✅ **İmza Doğrulama** - PDF ve XML belgelerindeki imzaları doğrulama
- ✅ **Zaman Damgası** - RFC 3161 uyumlu timestamp alma ve doğrulama
- ✅ Modern UI/UX (Topbar navigation)
- ✅ Type-safe API (OpenAPI generated)
- ✅ Dark mode
- ✅ Responsive tasarım
- ✅ shadcn/ui components
- ✅ TanStack Query
- ✅ Real-time status indicators

---

## 🛠️ Teknolojiler

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- shadcn/ui
- TanStack Query
- OpenAPI Generator

---

## ⚙️ Environment Variables

```bash
# .env
# Sign API (İmzalama servisi)
VITE_API_URL=http://localhost:8085

# Verify API (Doğrulama servisi) 
VITE_VERIFY_API_URL=http://localhost:8086
```

> **Not:** `VITE_VERIFY_API_URL` belirtilmezse varsayılan olarak `http://localhost:8086` kullanılır.

---

## 📂 Proje Yapısı

```
sign-ui/
├── src/
│   ├── api/generated/      # 🤖 Auto-generated
│   ├── components/         # React components
│   ├── pages/              # Sayfalar
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utils
```

---

## 🔗 Bağlantılar

| Link | Açıklama |
|------|----------|
| [**dss.mersel.dev**](https://dss.mersel.dev) | 📚 **Merkezi Dökümantasyon** |
| [**../sign-api**](../sign-api) | İmzalama Backend API |
| [**../verify-api**](../verify-api) | Doğrulama Backend API |

---

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

---

## 📄 Lisans

MIT

---

## 💡 Hatırlatma

**Component dökümanları, API entegrasyonu, hooks kullanımı ve tüm detaylar için:**

### 👉 [https://dss.mersel.dev](https://dss.mersel.dev) merkezi dökümantasyon sitesini ziyaret edin! 📚
