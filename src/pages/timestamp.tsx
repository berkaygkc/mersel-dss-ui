import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGetTimestamp, useValidateTimestamp, useTimestampStatus } from '@/hooks/use-timestamp';
import { Loader2, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function TimestampPage() {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [timestampFile, setTimestampFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const getTimestamp = useGetTimestamp();
  const validateTimestamp = useValidateTimestamp();
  const { data: statusData, isLoading: statusLoading } = useTimestampStatus();

  const handleGetTimestamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile) return;

    try {
      const result = await getTimestamp.mutateAsync({ document: documentFile });
      
      // Auto-download timestamp
      const blob = new Blob([result], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentFile.name}.tst`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Success toast
      toast.success('Timestamp Başarılı!', {
        description: `${documentFile.name}.tst dosyası oluşturuldu ve indiriliyor.`,
      });
    } catch (error) {
      // Error toast
      toast.error('Timestamp Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'Zaman damgası alınırken bir hata oluştu.',
      });
      console.error('Timestamp error:', error);
    }
  };

  const handleValidateTimestamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timestampFile) return;

    try {
      const result = await validateTimestamp.mutateAsync({
        timestampToken: timestampFile,
        originalDocument: originalFile || undefined,
      });
      
      // Success/Error toast based on validation result
      if (result.valid) {
        toast.success('Timestamp Geçerli!', {
          description: result.timestamp ? 
            `Zaman damgası doğrulandı: ${new Date(result.timestamp).toLocaleString('tr-TR')}` :
            'Zaman damgası geçerli.',
        });
      } else {
        toast.error('Timestamp Geçersiz!', {
          description: result.message || 'Zaman damgası doğrulanamadı.',
        });
      }
    } catch (error) {
      // Error toast
      toast.error('Doğrulama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'Doğrulama sırasında bir hata oluştu.',
      });
      console.error('Validation error:', error);
    }
  };

  // Auto-clear previous states on unmount
  useEffect(() => {
    return () => {
      getTimestamp.reset();
      validateTimestamp.reset();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timestamp (Zaman Damgası)</h1>
        <p className="mt-2 text-muted-foreground">
          Belgelere güvenilir zaman damgası ekleyin ve doğrulayın (RFC 3161)
        </p>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Timestamp Servis Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statusLoading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
          ) : statusData ? (
            <div className="flex items-center gap-4">
              <Badge variant={statusData.available ? 'success' : 'destructive'}>
                {statusData.available ? 'Aktif' : 'Kapalı'}
              </Badge>
              <p className="text-sm text-muted-foreground">{statusData.status}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Durum bilgisi alınamadı</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Get Timestamp */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Zaman Damgası Al
              </CardTitle>
              <CardDescription>
                Belgenize güvenilir zaman damgası ekleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGetTimestamp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document">Belge Dosyası</Label>
                  <Input
                    id="document"
                    type="file"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                    required
                  />
                  {documentFile && (
                    <p className="text-xs text-muted-foreground">
                      Seçilen: {documentFile.name} ({(documentFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={getTimestamp.isPending || !documentFile}
                >
                  {getTimestamp.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    'Zaman Damgası Al'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>

        {/* Validate Timestamp */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Zaman Damgası Doğrula
              </CardTitle>
              <CardDescription>
                Mevcut bir zaman damgasını doğrulayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleValidateTimestamp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timestamp">Timestamp Dosyası (.tst)</Label>
                  <Input
                    id="timestamp"
                    type="file"
                    accept=".tst"
                    onChange={(e) => setTimestampFile(e.target.files?.[0] || null)}
                    required
                  />
                  {timestampFile && (
                    <p className="text-xs text-muted-foreground">
                      Seçilen: {timestampFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original">Orijinal Belge (Opsiyonel)</Label>
                  <Input
                    id="original"
                    type="file"
                    onChange={(e) => setOriginalFile(e.target.files?.[0] || null)}
                  />
                  {originalFile && (
                    <p className="text-xs text-muted-foreground">
                      Seçilen: {originalFile.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={validateTimestamp.isPending || !timestampFile}
                >
                  {validateTimestamp.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Doğrulanıyor...
                    </>
                  ) : (
                    'Doğrula'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Validation Result Details */}
          {validateTimestamp.isSuccess && validateTimestamp.data && (
            <Card className={validateTimestamp.data.valid ? 'border-green-500/50' : 'border-destructive/50'}>
              <CardHeader>
                <CardTitle className={validateTimestamp.data.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                  {validateTimestamp.data.valid ? '✓ Geçerli Timestamp' : '✗ Geçersiz Timestamp'}
                </CardTitle>
                <CardDescription>Doğrulama detayları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 text-sm">
                  {validateTimestamp.data.timestamp && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarih:</span>
                      <span className="font-medium">{new Date(validateTimestamp.data.timestamp).toLocaleString('tr-TR')}</span>
                    </div>
                  )}
                  {validateTimestamp.data.tsaName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TSA:</span>
                      <span className="font-mono text-xs">{validateTimestamp.data.tsaName}</span>
                    </div>
                  )}
                  {validateTimestamp.data.hashAlgorithm && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hash:</span>
                      <span className="font-medium">{validateTimestamp.data.hashAlgorithm}</span>
                    </div>
                  )}
                  {validateTimestamp.data.serialNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seri No:</span>
                      <span className="font-mono text-xs">{validateTimestamp.data.serialNumber}</span>
                    </div>
                  )}
                  {validateTimestamp.data.signatureAlgorithm && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">İmza Algoritması:</span>
                      <span className="font-medium">{validateTimestamp.data.signatureAlgorithm}</span>
                    </div>
                  )}
                </div>
                {validateTimestamp.data.errors && validateTimestamp.data.errors.length > 0 && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-sm font-semibold text-destructive mb-2">Hatalar:</p>
                    <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                      {validateTimestamp.data.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>RFC 3161 Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Zaman Damgası Nedir?</strong>
              </p>
              <p>
                Bir belgenin belirli bir zamanda var olduğunu kanıtlayan güvenilir bir
                zaman işaretidir.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>RFC 3161 standardına uygun</li>
                <li>Dijital imzalarda zaman kaydı</li>
                <li>Yasal geçerlilik</li>
                <li>TÜBİTAK ESYA desteği</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
