import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCertificates, useKeystoreInfo, useTubitakCredit } from '@/hooks/use-certificates';
import { useTimestampStatus } from '@/hooks/use-timestamp';
import {
  FileText,
  FileCode,
  Mail,
  Clock,
  ShieldCheck,
  Activity,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function Dashboard() {
  const { data: certResponse, isLoading: certLoading } = useCertificates();
  const { data: keystoreInfo } = useKeystoreInfo();
  const { data: creditData, isLoading: creditLoading } = useTubitakCredit();
  const { data: timestampData, isLoading: timestampLoading } = useTimestampStatus();

  const certificateCount = certResponse?.certificateCount || 0;
  const keystoreType = certResponse?.keystoreType || 'N/A';
  
  // Aktif sertifika var mı?
  const hasActiveCertificate = certResponse?.success && certificateCount > 0;

  const features = [
    {
      name: 'PDF İmzalama',
      description: 'PAdES standardı ile PDF belge imzalama',
      icon: FileText,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      href: '/pdf-sign',
    },
    {
      name: 'XML İmzalama',
      description: 'XAdES ile XML belge imzalama (e-Fatura, e-Arşiv)',
      icon: FileCode,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      href: '/xml-sign',
    },
    {
      name: 'SOAP İmzalama',
      description: 'WS-Security ile SOAP mesaj imzalama',
      icon: Mail,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      href: '/soap-sign',
    },
    {
      name: 'Timestamp',
      description: 'Zaman damgası alma ve doğrulama',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      href: '/timestamp',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dijital imza işlemlerinizi yönetin ve izleyin
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Certificates */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sertifika</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {certLoading ? (
              <p className="text-2xl font-bold">...</p>
            ) : hasActiveCertificate ? (
              <>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{certificateCount}</p>
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {keystoreType} - Hazır
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Sertifika yok</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timestamp Status */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {timestampLoading ? (
              <p className="text-2xl font-bold">...</p>
            ) : (
              <>
                <Badge
                  variant={timestampData?.available ? 'success' : 'destructive'}
                  className="mb-2"
                >
                  {timestampData?.available ? 'Aktif' : 'Kapalı'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {timestampData?.status || 'Servis bilgisi yok'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* TÜBİTAK Credit */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TÜBİTAK Kontör</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {creditLoading ? (
              <p className="text-2xl font-bold">...</p>
            ) : creditData ? (
              <>
                <p className="text-2xl font-bold">{creditData.remainingCredit?.toLocaleString('tr-TR') || 0}</p>
                <p className="text-xs text-muted-foreground">
                  Kalan kontör
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Sorgulanamadı</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Keystore Info */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keystore</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {keystoreInfo ? (
              <>
                <p className="text-lg font-bold">
                  {Object.keys(keystoreInfo).length > 0 ? 'Yapılandırılmış' : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Object.entries(keystoreInfo)[0]?.[0] || 'Bilgi yok'}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">...</p>
                <p className="text-xs text-muted-foreground">Yükleniyor...</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">İmzalama İşlemleri</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Link key={feature.name} to={feature.href}>
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${feature.bgColor}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{feature.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
          <CardDescription>API ve backend durum bilgileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Backend URL:</span>
                <span className="font-mono font-medium text-xs">
                  {import.meta.env.VITE_API_URL || 'http://localhost:8085'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">API Version:</span>
                <span className="font-medium">v0.1.0</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Desteklenen Standartlar:</span>
                <span className="font-medium">PAdES, XAdES, WS-Security</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">RFC 3161</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
