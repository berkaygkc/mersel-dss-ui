import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCertificates, useKeystoreInfo } from '@/hooks/use-certificates';
import { ShieldCheck, RefreshCw, Key, AlertCircle, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export function CertificatesPage() {
  const { data: certResponse, isLoading: certLoading, error: certError, refetch: refetchCerts, isRefetching: certRefetching } = useCertificates();
  const { data: keystoreInfo, isLoading: keystoreLoading, refetch: refetchKeystore, isRefetching: keystoreRefetching } = useKeystoreInfo();

  const certificates = certResponse?.certificates || [];
  const keystoreType = certResponse?.keystoreType || 'N/A';
  const certificateCount = certResponse?.certificateCount || 0;
  
  const isRefreshing = certRefetching || keystoreRefetching;

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
          <h1 className="text-3xl font-bold text-slate-900">Sertifika Yönetimi</h1>
          <p className="mt-2 text-slate-600">
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
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {certLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
            </CardContent>
          </Card>
        ) : certError ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-4 font-medium text-red-800">Sertifikalar yüklenemedi</p>
              <p className="mt-2 text-sm text-red-600">
                {(certError as any)?.body?.message || (certError as any)?.message}
              </p>
            </CardContent>
          </Card>
        ) : certificates.length > 0 ? (
          certificates.map((cert, index) => {
            const subjectParts = parseDN(cert.subject || '');
            const issuerParts = parseDN(cert.issuer || '');
            const expired = isExpired(cert.validTo);
            const expiringSoon = isExpiringSoon(cert.validTo);

            return (
              <Card key={index} className="overflow-hidden">
                {/* Header with status */}
                <div className={`border-l-4 ${
                  expired ? 'border-red-500 bg-red-50' : 
                  expiringSoon ? 'border-orange-500 bg-orange-50' : 
                  'border-green-500 bg-green-50'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`rounded-lg p-3 ${
                          expired ? 'bg-red-100' : 
                          expiringSoon ? 'bg-orange-100' : 
                          'bg-green-100'
                        }`}>
                          <ShieldCheck className={`h-6 w-6 ${
                            expired ? 'text-red-600' : 
                            expiringSoon ? 'text-orange-600' : 
                            'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {subjectParts.CN || 'Sertifika'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Alias: <span className="font-mono font-medium">{cert.alias}</span>
                          </CardDescription>
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
                        ) : (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Aktif
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
                  </CardHeader>
                </div>

                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Subject & Issuer */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900">📄 Subject (Konu)</h4>
                        <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                          {Object.entries(subjectParts).map(([key, value]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-medium text-slate-600 min-w-[60px]">{key}:</span>
                              <span className="text-slate-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900">🏛️ Issuer (Veren)</h4>
                        <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                          {Object.entries(issuerParts).map(([key, value]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-medium text-slate-600 min-w-[60px]">{key}:</span>
                              <span className="text-slate-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Serial Numbers & Dates */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs text-slate-500">Seri No (Hex)</p>
                        <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                          {cert.serialNumberHex}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs text-slate-500">Seri No (Dec)</p>
                        <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                          {cert.serialNumberDec}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          Başlangıç
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-900">
                          {formatDate(cert.validFrom)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          Bitiş
                        </p>
                        <p className={`mt-1 text-xs font-medium ${
                          expired ? 'text-red-600' : expiringSoon ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {formatDate(cert.validTo)}
                        </p>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-slate-900">🔐 Teknik Detaylar</h4>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs text-slate-500">Tip</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{cert.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">İmza Algoritması</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {cert.signatureAlgorithm}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Key Usage</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{cert.keyUsage}</p>
                        </div>
                      </div>

                      {cert.extendedKeyUsage && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-500">Extended Key Usage</p>
                          <p className="mt-1 font-mono text-xs text-slate-700">
                            {cert.extendedKeyUsage}
                          </p>
                        </div>
                      )}

                      {cert.certificatePolicies && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-500">Certificate Policies</p>
                          <p className="mt-1 text-xs text-slate-700 break-all">
                            {cert.certificatePolicies}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 font-medium text-slate-700">Sertifika bulunamadı</p>
              <p className="mt-2 text-sm text-slate-600">
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
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(keystoreInfo).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{key}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
