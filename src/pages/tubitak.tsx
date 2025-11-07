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
        <h1 className="text-3xl font-bold text-slate-900">TÜBİTAK Kontör Sorgulama</h1>
        <p className="mt-2 text-slate-600">
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
                <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                <p className="mt-2 text-sm font-medium text-red-800">
                  Kontör sorgulanamadı
                </p>
                <p className="mt-1 text-xs text-red-600">
                  {(error as any)?.body?.message || (error as any)?.message}
                </p>
              </div>
            ) : creditData ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Kalan Kontör</p>
                  <p className="mt-2 text-5xl font-bold text-slate-900">
                    {creditData.remainingCredit?.toLocaleString('tr-TR') || 0}
                  </p>
                </div>

                {creditData.customerId && (
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Müşteri ID:</span>
                      <Badge variant="secondary">{creditData.customerId}</Badge>
                    </div>
                  </div>
                )}

                {creditData.message && (
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-blue-700">{creditData.message}</p>
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
              <p className="text-center text-sm text-slate-600">Veri yok</p>
            )}
          </CardContent>
        </Card>

        {/* Info & Usage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontör Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">TÜBİTAK ESYA Timestamp Servisi</p>
                <p className="mt-1">
                  TÜBİTAK tarafından sağlanan güvenilir zaman damgası servisi için
                  kontör bakiyenizi buradan takip edebilirsiniz.
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Kontör Kullanımı</p>
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
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="rounded-lg bg-yellow-50 p-3">
                <p className="font-medium text-yellow-800">⚠️ Uyarı</p>
                <p className="mt-1 text-xs text-yellow-700">
                  Kontör bakiyenizin düşük olması durumunda timestamp içeren
                  imzalama işlemleri başarısız olabilir.
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="font-medium text-blue-800">ℹ️ Bilgi</p>
                <p className="mt-1 text-xs text-blue-700">
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
