import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useGetTimestamp, useValidateTimestamp, useTimestampStatus } from '@/hooks/use-timestamp';
import { Loader2, Clock, CheckCircle, AlertCircle, Activity, Download } from 'lucide-react';

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
    } catch (error) {
      console.error('Timestamp error:', error);
    }
  };

  const handleValidateTimestamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timestampFile) return;

    try {
      await validateTimestamp.mutateAsync({
        timestampToken: timestampFile,
        originalDocument: originalFile || undefined,
      });
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Timestamp (Zaman Damgası)</h1>
        <p className="mt-2 text-slate-600">
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
            <p className="text-sm text-slate-600">Yükleniyor...</p>
          ) : statusData ? (
            <div className="flex items-center gap-4">
              <Badge variant={statusData.available ? 'success' : 'destructive'}>
                {statusData.available ? 'Aktif' : 'Kapalı'}
              </Badge>
              <p className="text-sm text-slate-600">{statusData.status}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Durum bilgisi alınamadı</p>
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
                    <p className="text-xs text-slate-600">
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

          {/* Get Timestamp Result */}
          {getTimestamp.isSuccess && (
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Başarılı!</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <p>Zaman damgası başarıyla oluşturuldu ve indirildi.</p>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">.tst dosyası indiriliyor...</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {getTimestamp.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata!</AlertTitle>
              <AlertDescription>
                {(getTimestamp.error as any)?.body?.message ||
                  (getTimestamp.error as any)?.message ||
                  'Zaman damgası alınırken bir hata oluştu.'}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Validate Timestamp */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
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
                    <p className="text-xs text-slate-600">
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
                    <p className="text-xs text-slate-600">
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

          {/* Validate Result */}
          {validateTimestamp.isSuccess && validateTimestamp.data && (
            <Alert variant={validateTimestamp.data.valid ? 'success' : 'destructive'}>
              {validateTimestamp.data.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {validateTimestamp.data.valid ? 'Geçerli!' : 'Geçersiz!'}
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2 text-xs">
                  {validateTimestamp.data.timestamp && (
                    <p>
                      <strong>Tarih:</strong>{' '}
                      {new Date(validateTimestamp.data.timestamp).toLocaleString('tr-TR')}
                    </p>
                  )}
                  {validateTimestamp.data.tsaName && (
                    <p>
                      <strong>TSA:</strong> {validateTimestamp.data.tsaName}
                    </p>
                  )}
                  {validateTimestamp.data.hashAlgorithm && (
                    <p>
                      <strong>Hash:</strong> {validateTimestamp.data.hashAlgorithm}
                    </p>
                  )}
                  {validateTimestamp.data.serialNumber && (
                    <p>
                      <strong>Seri No:</strong> {validateTimestamp.data.serialNumber}
                    </p>
                  )}
                  {validateTimestamp.data.errors && validateTimestamp.data.errors.length > 0 && (
                    <div className="mt-2">
                      <strong>Hatalar:</strong>
                      <ul className="list-inside list-disc">
                        {validateTimestamp.data.errors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validateTimestamp.data.message && (
                    <p className="mt-2">{validateTimestamp.data.message}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {validateTimestamp.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata!</AlertTitle>
              <AlertDescription>
                {(validateTimestamp.error as any)?.body?.message ||
                  (validateTimestamp.error as any)?.message ||
                  'Doğrulama sırasında bir hata oluştu.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>RFC 3161 Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
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
