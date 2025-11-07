# Sign API - Frontend UI

Modern, responsive dijital imza yönetim arayüzü.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - UI components (will be added)
- **React Router** - Navigation (will be added)
- **React Query** - Server state management (will be added)
- **Axios** - HTTP client (will be added)

## 📋 Prerequisites

- Node.js 20+
- Yarn 1.22+
- Backend API running on `http://localhost:8085`

## 🛠️ Setup

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev
```

## 🔧 Available Scripts

```bash
# Development
yarn dev              # Start Vite dev server (http://localhost:5173)

# Build
yarn build            # TypeScript compile + Vite build

# Preview
yarn preview          # Preview production build

# API Client Generation
yarn generate-api     # Generate TypeScript client from OpenAPI spec
```

## 🌐 Environment Variables

### `.env.development`
```
VITE_API_URL=http://localhost:8085
```

### `.env.production`
```
VITE_API_URL=https://api.yourdomain.com
```

## 📁 Project Structure

```
sign-ui/
├── src/
│   ├── api/              # Auto-generated OpenAPI client
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   └── sign/         # Sign-specific components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Features (Planned)

### Pages
- **Dashboard** - Ana sayfa, istatistikler
- **PDF İmzalama** - PDF belgelerini PAdES ile imzala
- **XML İmzalama** - XML belgelerini XAdES ile imzala (e-Fatura, e-Arşiv, vb.)
- **SOAP İmzalama** - SOAP mesajlarını WS-Security ile imzala
- **Timestamp** - Zaman damgası alma ve doğrulama
- **TÜBİTAK Kontör** - Kontör sorgulama
- **Sertifikalar** - Sertifika listesi ve yönetimi

### API Integration
Backend API endpoints:
- `POST /v1/padessign` - PDF imzalama
- `POST /v1/xadessign` - XML imzalama
- `POST /v1/wssecuritysign` - SOAP imzalama
- `POST /api/timestamp/get` - Timestamp alma
- `POST /api/timestamp/validate` - Timestamp doğrulama
- `GET /api/timestamp/status` - Timestamp servis durumu
- `GET /api/tubitak/credit` - TÜBİTAK kontör sorgulama
- `GET /api/certificates/list` - Sertifika listesi
- `GET /api/certificates/info` - Keystore bilgisi

## 🔗 Related Repositories

- **Backend API**: `sign-api` (Java/Spring Boot)
- **.NET API**: Coming soon

## 📝 Development Notes

- Proxy configured: `/api` → `http://localhost:8085`
- OpenAPI client will be auto-generated from backend
- shadcn/ui components will be added incrementally
- Dark mode support planned

## 🚧 Next Steps

1. Install additional dependencies (React Router, React Query, Axios, etc.)
2. Setup shadcn/ui
3. Generate OpenAPI TypeScript client
4. Create layout structure
5. Implement pages and features

---

**Note**: This is the frontend for the Sign API project. Make sure the backend is running before starting development.


