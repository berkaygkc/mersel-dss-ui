import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTubitakCredit } from '@/hooks/use-certificates';
import { CreditCard, RefreshCw, AlertCircle, TrendingUp, Info, AlertTriangle } from 'lucide-react';

export function TubitakPage() {
  const { data: creditData, isLoading, error, refetch, isRefetching } = useTubitakCredit();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">TÜBİTAK Kontör Sorgulama</h1>
          <p className="mt-2 text-muted-foreground">
            TÜBİTAK ESYA timestamp servis kontörünüzü sorgulayın
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isRefetching}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Yenileniyor...' : 'Kontörü Yenile'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Credit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Kontör Durumu
            </CardTitle>
            <CardDescription>
              Mevcut kontör bakiyeniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || isRefetching ? (
              <div className="space-y-6">
                {/* Main credit skeleton */}
                <div className="rounded-xl border p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-16 w-48" />
                </div>
                
                {/* Customer ID skeleton */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <p className="text-base font-semibold">
                      Kontör sorgulanamadı
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {(error as any)?.body?.message || (error as any)?.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : creditData ? (
              <div className="space-y-6">
                {/* Main Credit Display */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-6">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-violet-500/5" />
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-purple-500/5" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-violet-500" />
                      <p className="text-sm font-medium text-muted-foreground">Kalan Kontör</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <p className="text-6xl font-bold bg-gradient-to-br from-violet-500 to-purple-600 bg-clip-text text-transparent">
                        {creditData.remainingCredit?.toLocaleString('tr-TR') || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer ID */}
                {creditData.customerId && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">Müşteri ID</span>
                      </div>
                      <span className="font-mono text-lg font-semibold">{creditData.customerId}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Veri yok</p>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Kontör Bilgileri</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground leading-relaxed">
                TÜBİTAK tarafından sağlanan güvenilir zaman damgası servisi için
                kontör bakiyenizi buradan takip edebilirsiniz.
              </p>
              
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  <p className="font-semibold">Kontör Kullanımı</p>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-violet-500">•</span>
                    <span>Her timestamp talebi kontör kullanır</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-violet-500">•</span>
                    <span>e-Fatura ve e-Arşiv imzalama</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-violet-500">•</span>
                    <span>PAdES-T ve PAdES-LT imzalar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-violet-500">•</span>
                    <span>XAdES-T ve XAdES-LT imzalar</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Important Notes - 2 Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Warning Card */}
        <Card className="border-orange-500/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <CardTitle>Uyarı</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kontör bakiyenizin düşük olması durumunda timestamp içeren
              imzalama işlemleri başarısız olabilir.
            </p>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-blue-500/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle>Bilgi</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kontör bakiyeniz otomatik olarak her dakika güncellenir.
              Manuel yenilemek için yukarıdaki "Kontörü Yenile" butonunu kullanabilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
