import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCertificates, useKeystoreInfo } from '@/hooks/use-certificates';
import { ShieldCheck, RefreshCw, Key, AlertCircle, Calendar, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

export function CertificatesPage() {
  const { data: certResponse, isLoading: certLoading, error: certError, refetch: refetchCerts, isRefetching: certRefetching } = useCertificates();
  const { data: keystoreInfo, isLoading: keystoreLoading, refetch: refetchKeystore, isRefetching: keystoreRefetching } = useKeystoreInfo();

  const certificates = certResponse?.certificates || [];
  const keystoreType = certResponse?.keystoreType || 'N/A';
  const certificateCount = certResponse?.certificateCount || 0;
  
  const isRefreshing = certRefetching || keystoreRefetching;
  
  // Keystore'da aktif olarak seçilen sertifikanın serial number'ı
  const activeSerialNumber = keystoreInfo?.certificateSerialNumber as string | undefined;
  
  // Sertifikanın aktif olup olmadığını kontrol et
  const isActiveCertificate = (cert: any) => {
    if (!activeSerialNumber) return false;
    // Hex veya Dec formatında eşleşme kontrolü
    return cert.serialNumberHex === activeSerialNumber || 
           cert.serialNumberDec === activeSerialNumber ||
           cert.serialNumberHex?.toLowerCase() === activeSerialNumber?.toLowerCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const isExpired = (validTo?: string) => {
    if (!validTo) return false;
    try {
      return new Date(validTo) < new Date();
    } catch {
      return false;
    }
  };

  const isExpiringSoon = (validTo?: string) => {
    if (!validTo) return false;
    try {
      const expiryDate = new Date(validTo);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate < thirtyDaysFromNow && expiryDate > new Date();
    } catch {
      return false;
    }
  };

  const parseDN = (dn: string) => {
    const parts: Record<string, string> = {};
    dn.split(',').forEach(part => {
      const [key, ...valueParts] = part.trim().split('=');
      if (key && valueParts.length) {
        parts[key] = valueParts.join('=');
      }
    });
    return parts;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sertifika Yönetimi</h1>
          <p className="mt-2 text-muted-foreground">
            Keystore'unuzdaki dijital sertifikaları görüntüleyin ve yönetin
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            refetchKeystore();
            refetchCerts();
          }}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
        </Button>
      </div>

      {/* Keystore Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {certLoading ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-28 mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-16 mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-24 mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keystore Tipi</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keystoreType}</div>
                <p className="text-xs text-muted-foreground">Sertifika deposu türü</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Sertifika</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certificateCount}</div>
                <p className="text-xs text-muted-foreground">Yüklü sertifika sayısı</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Durum</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certResponse?.success ? '✓ Hazır' : '✗ Hata'}
                </div>
                <p className="text-xs text-muted-foreground">Sistem durumu</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Sertifika Listesi</h2>
            <p className="text-sm text-muted-foreground">
              Detayları görüntülemek için sertifikaya tıklayın
            </p>
          </div>
          {certificates.length > 0 && (
            <Badge variant="outline">
              {certificates.length} Sertifika
            </Badge>
          )}
        </div>
        
        {certLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : certError ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <p className="text-base font-semibold">Sertifikalar yüklenemedi</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {(certError as any)?.body?.message || (certError as any)?.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : certificates.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {certificates.map((cert, index) => {
              const subjectParts = parseDN(cert.subject || '');
              const issuerParts = parseDN(cert.issuer || '');
              const expired = isExpired(cert.validTo);
              const expiringSoon = isExpiringSoon(cert.validTo);
              const isActive = isActiveCertificate(cert);

              return (
                <AccordionItem key={index} value={`cert-${index}`} className="border-none">
                  <Card className="overflow-hidden">
                    {/* Header with status */}
                    <div className={`border-l-4 ${
                      expired ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 
                      expiringSoon ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 
                      isActive ? 'border-green-500 bg-green-50 dark:bg-green-950/20' :
                      'border-slate-500 bg-slate-50 dark:bg-slate-950/20'
                    }`}>
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-start justify-between w-full pr-4">
                          <div className="flex items-start gap-4">
                            <div className={`rounded-lg p-3 ${
                              expired ? 'bg-red-100 dark:bg-red-950/50' : 
                              expiringSoon ? 'bg-orange-100 dark:bg-orange-950/50' : 
                              isActive ? 'bg-green-100 dark:bg-green-950/50' :
                              'bg-slate-100 dark:bg-slate-800'
                            }`}>
                              <ShieldCheck className={`h-6 w-6 ${
                                expired ? 'text-red-600 dark:text-red-400' : 
                                expiringSoon ? 'text-orange-600 dark:text-orange-400' : 
                                isActive ? 'text-green-600 dark:text-green-400' :
                                'text-slate-600 dark:text-slate-400'
                              }`} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-lg font-semibold">
                                {subjectParts.CN || 'Sertifika'}
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                Alias: <span className="font-mono font-medium">{cert.alias}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {expired ? (
                              <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Süresi Dolmuş
                              </Badge>
                            ) : expiringSoon ? (
                              <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Yakında Dolacak
                              </Badge>
                            ) : isActive ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Aktif
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Pasif
                              </Badge>
                            )}
                            {cert.hasPrivateKey && (
                              <Badge variant="secondary" className="gap-1">
                                <Key className="h-3 w-3" />
                                Private Key
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                    </div>

                    <AccordionContent>
                      <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Subject & Issuer */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">📄 Subject (Konu)</h4>
                        <div className="rounded-lg bg-muted p-3 space-y-1">
                          {Object.entries(subjectParts).map(([key, value]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-medium text-muted-foreground min-w-[60px]">{key}:</span>
                              <span className="text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">🏛️ Issuer (Veren)</h4>
                        <div className="rounded-lg bg-muted p-3 space-y-1">
                          {Object.entries(issuerParts).map(([key, value]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-medium text-muted-foreground min-w-[60px]">{key}:</span>
                              <span className="text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Serial Numbers & Dates */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border bg-card p-3">
                        <p className="text-xs text-muted-foreground">Seri No (Hex)</p>
                        <p className="mt-1 font-mono text-sm font-medium">
                          {cert.serialNumberHex}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <p className="text-xs text-muted-foreground">Seri No (Dec)</p>
                        <p className="mt-1 font-mono text-sm font-medium">
                          {cert.serialNumberDec}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Başlangıç
                        </p>
                        <p className="mt-1 text-xs font-medium">
                          {formatDate(cert.validFrom)}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-card p-3">
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Bitiş
                        </p>
                        <p className={`mt-1 text-xs font-medium ${
                          expired ? 'text-red-600 dark:text-red-400' : expiringSoon ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                        }`}>
                          {formatDate(cert.validTo)}
                        </p>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="rounded-lg border bg-muted p-4">
                      <h4 className="mb-3 text-sm font-semibold">🔐 Teknik Detaylar</h4>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Tip</p>
                          <p className="mt-1 text-sm font-medium">{cert.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">İmza Algoritması</p>
                          <p className="mt-1 text-sm font-medium">
                            {cert.signatureAlgorithm}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Key Usage</p>
                          <p className="mt-1 text-sm font-medium">{cert.keyUsage}</p>
                        </div>
                      </div>

                      {cert.extendedKeyUsage && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">Extended Key Usage</p>
                          <p className="mt-1 font-mono text-xs">
                            {cert.extendedKeyUsage}
                          </p>
                        </div>
                      )}

                      {cert.certificatePolicies && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">Certificate Policies</p>
                          <p className="mt-1 text-xs break-all">
                            {cert.certificatePolicies}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-medium">Sertifika bulunamadı</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Keystore'unuzda dijital sertifika bulunmuyor.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Info */}
      {keystoreInfo && Object.keys(keystoreInfo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keystore Detayları</CardTitle>
            <CardDescription>Yapılandırma bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(keystoreInfo).map(([key, value]) => {
                // Skip empty values
                if (value === null || value === undefined || value === '') return null;
                
                // Türkçe label mapping
                const labelMap: Record<string, string> = {
                  success: 'Durum',
                  keystoreType: 'Keystore Tipi',
                  certificateAlias: 'Sertifika Alias',
                  certificateSerialNumber: 'Seri Numarası',
                  pfxPath: 'PFX Dosya Yolu',
                  pkcs11Library: 'PKCS11 Kütüphane',
                  pkcs11Slot: 'PKCS11 Slot',
                };
                
                const label = labelMap[key] || key;
                const displayValue = typeof value === 'boolean' 
                  ? (value ? '✓ Başarılı' : '✗ Hata')
                  : typeof value === 'object' 
                    ? JSON.stringify(value, null, 2) 
                    : String(value);
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <p className={`text-sm ${key === 'pfxPath' || key === 'pkcs11Library' ? 'font-mono text-xs break-all' : ''}`}>
                        {displayValue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
