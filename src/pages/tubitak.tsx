import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTubitakCredit } from '@/hooks/use-certificates';
import { CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

export function TubitakPage() {
  const { data: creditData, isLoading, error, refetch, isRefetching } = useTubitakCredit();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">TÜBİTAK Kontör Sorgulama</h1>
        <p className="mt-2 text-muted-foreground">
          TÜBİTAK ESYA timestamp servis kontörünüzü sorgulayın
        </p>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
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
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Kalan Kontör</p>
                  <p className="mt-2 text-5xl font-bold">
                    {creditData.remainingCredit?.toLocaleString('tr-TR') || 0}
                  </p>
                </div>

                {creditData.customerId && (
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Müşteri ID:</span>
                      <Badge variant="secondary">{creditData.customerId}</Badge>
                    </div>
                  </div>
                )}

                {creditData.message && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs">{creditData.message}</p>
                  </div>
                )}

                <Button
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="w-full"
                  variant="outline"
                >
                  {isRefetching ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Yenileniyor...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Yenile
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Veri yok</p>
            )}
          </CardContent>
        </Card>

        {/* Info & Usage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontör Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium">TÜBİTAK ESYA Timestamp Servisi</p>
                <p className="mt-1">
                  TÜBİTAK tarafından sağlanan güvenilir zaman damgası servisi için
                  kontör bakiyenizi buradan takip edebilirsiniz.
                </p>
              </div>
              <div>
                <p className="font-medium">Kontör Kullanımı</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>Her timestamp talebi kontör kullanır</li>
                  <li>e-Fatura ve e-Arşiv imzalama</li>
                  <li>PAdES-T ve PAdES-LT imzalar</li>
                  <li>XAdES-T ve XAdES-LT imzalar</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Önemli Notlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">⚠️ Uyarı</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Kontör bakiyenizin düşük olması durumunda timestamp içeren
                  imzalama işlemleri başarısız olabilir.
                </p>
              </div>
              <div className="rounded-lg border bg-muted p-4">
                <p className="text-sm font-semibold">ℹ️ Bilgi</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Kontör bakiyeniz otomatik olarak her dakika güncellenir.
                  Manuel yenilemek için "Yenile" butonunu kullanabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
