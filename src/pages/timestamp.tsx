import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetTimestamp, useValidateTimestamp, useTimestampStatus } from '@/hooks/use-timestamp';
import { Loader2, Clock, Activity, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

export function TimestampPage() {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [timestampFile, setTimestampFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getTimestamp = useGetTimestamp();
  const validateTimestamp = useValidateTimestamp();
  const { data: statusData, isLoading: statusLoading } = useTimestampStatus();

  const handleGetTimestamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile) return;

    try {
      const result = await getTimestamp.mutateAsync({ document: documentFile });
      
      // Auto-download timestamp (result is ArrayBuffer)
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
      await validateTimestamp.mutateAsync({
        timestampToken: timestampFile,
        originalDocument: originalFile || undefined,
      });
      
      // Open modal to show results
      setIsDialogOpen(true);
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

      {/* Service Status - Only show if NOT active */}
      {statusData && !statusData.available && (
        <Card className="border-orange-500/60 bg-orange-500/5 dark:bg-orange-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Activity className="h-5 w-5" />
              Timestamp Servisi Aktif Değil
            </CardTitle>
            <CardDescription>
              Zaman damgası servisi şu anda kullanılamıyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-foreground/80">
                {statusData.status || 'Timestamp servisi yapılandırılmamış veya erişilemiyor.'}
              </p>
              <div className="rounded-lg border border-orange-500/40 bg-background p-3">
                <p className="text-xs font-medium text-foreground/60 mb-1.5">Yapılması Gerekenler:</p>
                <ul className="space-y-1.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">•</span>
                    Backend'de TS_SERVER_HOST ayarını kontrol edin
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">•</span>
                    TÜBİTAK ESYA kontörünüzü kontrol edin
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">•</span>
                    Backend loglarını inceleyin
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card - Moved to top */}
      <Card className="border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            RFC 3161 Timestamp Hakkında
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bir belgenin belirli bir zamanda var olduğunu kanıtlayan güvenilir bir
              zaman işaretidir. RFC 3161 standardına uygun zaman damgaları, dijital 
              imzalı belgelerin yasal geçerliliğini artırır.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                RFC 3161 Uyumlu
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <Clock className="h-3.5 w-3.5" />
                Zaman Kaydı
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <Activity className="h-3.5 w-3.5" />
                Yasal Geçerlilik
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                TÜBİTAK ESYA
              </Badge>
            </div>
          </div>
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

        </div>
      </div>

      {/* Validation Results Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] [&>button]:hidden p-0 gap-0">
          {validateTimestamp.data && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b relative">
                {/* Close Button - Top Right */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute right-6 top-6 h-8 w-8 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-xl pr-12 ${validateTimestamp.data.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {validateTimestamp.data.valid ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        Geçerli Timestamp
                      </>
                    ) : (
                      <>
                        <Activity className="h-6 w-6" />
                        Geçersiz Timestamp
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {validateTimestamp.data.valid 
                      ? 'Zaman damgası başarıyla doğrulandı ve geçerli'
                      : 'Zaman damgası doğrulanamadı veya geçersiz'}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                {/* Timestamp Info Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {validateTimestamp.data.timestamp && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-foreground/60 mb-1.5">Zaman Damgası</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(validateTimestamp.data.timestamp).toLocaleString('tr-TR', {
                          dateStyle: 'full',
                          timeStyle: 'medium'
                        })}
                      </p>
                    </div>
                  )}
                  {validateTimestamp.data.serialNumber && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-foreground/60 mb-1.5">Seri Numarası</p>
                      <p className="text-sm font-mono font-semibold text-foreground break-all">{validateTimestamp.data.serialNumber}</p>
                    </div>
                  )}
                  {validateTimestamp.data.hashAlgorithm && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-foreground/60 mb-1.5">Hash Algoritması</p>
                      <p className="text-sm font-semibold text-foreground">
                        {validateTimestamp.data.hashAlgorithm}
                      </p>
                      {validateTimestamp.data.hashAlgorithmOid && (
                        <p className="text-xs font-mono text-foreground/40 mt-1.5">
                          {validateTimestamp.data.hashAlgorithmOid}
                        </p>
                      )}
                    </div>
                  )}
                  {validateTimestamp.data.signatureAlgorithm && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-foreground/60 mb-1.5">İmza Algoritması</p>
                      <p className="text-sm font-semibold text-foreground">
                        {validateTimestamp.data.signatureAlgorithm}
                      </p>
                      {validateTimestamp.data.signatureAlgorithmOid && (
                        <p className="text-xs font-mono text-foreground/40 mt-1.5">
                          {validateTimestamp.data.signatureAlgorithmOid}
                        </p>
                      )}
                    </div>
                  )}
                  {validateTimestamp.data.nonce && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-foreground/60 mb-1.5">Nonce</p>
                      <p className="text-sm font-mono text-xs font-semibold text-foreground break-all">{validateTimestamp.data.nonce}</p>
                    </div>
                  )}
                  {typeof validateTimestamp.data.certificateValid !== 'undefined' && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-foreground/60 mb-1.5">TSA Sertifika Durumu</p>
                      <p className={`text-sm font-semibold ${validateTimestamp.data.certificateValid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                        {validateTimestamp.data.certificateValid ? '✓ Geçerli' : '✗ Geçersiz/Süresi Dolmuş'}
                      </p>
                    </div>
                  )}
                </div>

                {/* TSA Information */}
                {validateTimestamp.data.tsaName && (
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-xs font-bold text-foreground mb-2">Zaman Damgası Otoritesi (TSA)</p>
                    <p className="text-sm font-mono text-foreground/90 break-all">{validateTimestamp.data.tsaName}</p>
                    {(validateTimestamp.data.certificateNotBefore || validateTimestamp.data.certificateNotAfter) && (
                      <div className="mt-3 grid gap-2 md:grid-cols-2 text-xs">
                        {validateTimestamp.data.certificateNotBefore && (
                          <div>
                            <span className="font-medium text-foreground/60">Geçerlilik Başlangıcı: </span>
                            <span className="font-semibold text-foreground">
                              {new Date(validateTimestamp.data.certificateNotBefore).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        )}
                        {validateTimestamp.data.certificateNotAfter && (
                          <div>
                            <span className="font-medium text-foreground/60">Geçerlilik Bitişi: </span>
                            <span className="font-semibold text-foreground">
                              {new Date(validateTimestamp.data.certificateNotAfter).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Hash Verification Status */}
                {typeof validateTimestamp.data.hashVerified !== 'undefined' && validateTimestamp.data.hashVerified !== null && (
                  <div className={`rounded-lg border-2 p-4 ${validateTimestamp.data.hashVerified ? 'border-green-500/60 bg-green-500/5 dark:bg-green-500/10' : 'border-red-500/60 bg-red-500/5 dark:bg-red-500/10'}`}>
                    <p className={`text-sm font-bold mb-1.5 flex items-center gap-2 ${validateTimestamp.data.hashVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {validateTimestamp.data.hashVerified ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Hash Doğrulaması Başarılı
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Hash Doğrulaması Başarısız
                        </>
                      )}
                    </p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {validateTimestamp.data.hashVerified 
                        ? 'Orijinal belgenin hash değeri timestamp token içindeki hash ile eşleşiyor.'
                        : 'Orijinal belgenin hash değeri eşleşmiyor - belge değiştirilmiş olabilir.'}
                    </p>
                  </div>
                )}

                {/* Errors */}
                {validateTimestamp.data.errors && validateTimestamp.data.errors.length > 0 && (
                  <div className="rounded-lg border-2 border-orange-500/60 bg-orange-500/5 dark:bg-orange-500/10 p-4">
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Doğrulama Hataları
                    </p>
                    <ul className="space-y-2">
                      {validateTimestamp.data.errors.map((error, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                          <span className="text-orange-600 dark:text-orange-400 mt-0.5 font-bold">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Message */}
                {validateTimestamp.data.message && validateTimestamp.data.valid && (
                  <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {validateTimestamp.data.message}
                    </p>
                  </div>
                )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
