import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCertificates, useKeystoreInfo, useTubitakCredit } from '@/hooks/use-certificates';
import { useTimestampStatus } from '@/hooks/use-timestamp';
import {
  Clock,
  ShieldCheck,
  Activity,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  PenTool,
} from 'lucide-react';

export function Dashboard() {
  const { data: certResponse, isLoading: certLoading } = useCertificates();
  const { data: keystoreInfo, isLoading: keystoreLoading } = useKeystoreInfo();
  const { data: creditData, isLoading: creditLoading } = useTubitakCredit();
  const { data: timestampData, isLoading: timestampLoading } = useTimestampStatus();

  const certificateCount = certResponse?.certificateCount || 0;
  const keystoreType = certResponse?.keystoreType || 'N/A';
  
  // Aktif sertifika var mı?
  const hasActiveCertificate = certResponse?.success && certificateCount > 0;

  const features = [
    {
      name: 'Dijital İmzalama',
      description: 'PDF, XML ve SOAP belgelerinizi dijital olarak imzalayın',
      icon: PenTool,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950',
      href: '/sign',
    },
    {
      name: 'Zaman Damgası',
      description: 'RFC 3161 uyumlu zaman damgası alma ve doğrulama',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
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
        {certLoading ? (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-24 mb-3" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sertifika</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {hasActiveCertificate ? (
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
        )}

        {/* Timestamp Status */}
        {timestampLoading ? (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20 mb-3" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zaman Damgası</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        {/* TÜBİTAK Credit */}
        {creditLoading ? (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-28 mb-3" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TÜBİTAK Kontör</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {creditData ? (
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
        )}

        {/* Keystore Info */}
        {keystoreLoading ? (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-40 mb-3" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
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
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Bilgi yok</p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

          {/* Features Grid */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Hızlı Erişim</h2>
            <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Link key={feature.name} to={feature.href}>
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
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
                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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
                <span className="text-muted-foreground">Zaman Damgası:</span>
                <span className="font-medium">RFC 3161</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
