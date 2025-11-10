import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  useVerifyPDF, 
  useVerifyXML, 
  useVerifyTimestamp,
  VerificationLevel,
  type VerificationResult,
  type TimestampVerificationResult 
} from '@/hooks/use-verify';
import { 
  Loader2, 
  FileText, 
  FileCode, 
  Clock, 
  CheckCircle2, 
  Info, 
  AlertCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export function VerifyPage() {
  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfLevel, setPdfLevel] = useState<VerificationLevel>(VerificationLevel.SIMPLE);
  const [pdfResult, setPdfResult] = useState<VerificationResult | null>(null);

  // XML state
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlOriginalFile, setXmlOriginalFile] = useState<File | null>(null);
  const [xmlLevel, setXmlLevel] = useState<VerificationLevel>(VerificationLevel.SIMPLE);
  const [xmlResult, setXmlResult] = useState<VerificationResult | null>(null);

  // Timestamp state
  const [timestampFile, setTimestampFile] = useState<File | null>(null);
  const [timestampOriginalData, setTimestampOriginalData] = useState<File | null>(null);
  const [timestampValidateCert, setTimestampValidateCert] = useState(true);
  const [timestampResult, setTimestampResult] = useState<TimestampVerificationResult | null>(null);

  const verifyPDF = useVerifyPDF();
  const verifyXML = useVerifyXML();
  const verifyTimestamp = useVerifyTimestamp();

  // PDF Verify Handler
  const handlePDFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    try {
      const result = await verifyPDF.mutateAsync({
        signedDocument: pdfFile,
        level: pdfLevel,
      });

      setPdfResult(result);

      if (result.valid) {
        toast.success('PDF Doğrulama Başarılı!', {
          description: `${pdfFile.name} doğrulandı. İmza geçerli.`,
        });
      } else {
        toast.warning('PDF Doğrulama Tamamlandı', {
          description: 'İmza geçersiz veya sorunlar tespit edildi.',
        });
      }
    } catch (error) {
      toast.error('PDF Doğrulama Hatası!', {
        description: (error as any)?.message || 'PDF doğrulama sırasında bir hata oluştu.',
      });
      setPdfResult(null);
    }
  };

  // XML Verify Handler
  const handleXMLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmlFile) return;

    try {
      const result = await verifyXML.mutateAsync({
        signedDocument: xmlFile,
        originalDocument: xmlOriginalFile || undefined,
        level: xmlLevel,
      });

      setXmlResult(result);

      if (result.valid) {
        toast.success('XML Doğrulama Başarılı!', {
          description: `${xmlFile.name} doğrulandı. İmza geçerli.`,
        });
      } else {
        toast.warning('XML Doğrulama Tamamlandı', {
          description: 'İmza geçersiz veya sorunlar tespit edildi.',
        });
      }
    } catch (error) {
      toast.error('XML Doğrulama Hatası!', {
        description: (error as any)?.message || 'XML doğrulama sırasında bir hata oluştu.',
      });
      setXmlResult(null);
    }
  };

  // Timestamp Verify Handler
  const handleTimestampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timestampFile) return;

    try {
      const result = await verifyTimestamp.mutateAsync({
        timestampToken: timestampFile,
        originalData: timestampOriginalData || undefined,
        validateCertificate: timestampValidateCert,
      });

      setTimestampResult(result);

      if (result.valid) {
        toast.success('Zaman Damgası Doğrulama Başarılı!', {
          description: `${timestampFile.name} doğrulandı. Geçerli.`,
        });
      } else {
        toast.warning('Zaman Damgası Doğrulama Tamamlandı', {
          description: 'Zaman damgası geçersiz veya sorunlar tespit edildi.',
        });
      }
    } catch (error) {
      toast.error('Zaman Damgası Doğrulama Hatası!', {
        description: (error as any)?.message || 'Zaman damgası doğrulama sırasında bir hata oluştu.',
      });
      setTimestampResult(null);
    }
  };

  // Render Verification Result
  const renderVerificationResult = (result: VerificationResult | null) => {
    if (!result) return null;

    return (
      <Alert className={result.valid ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
        <div className="flex items-start gap-3">
          {result.valid ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          )}
          <div className="flex-1 space-y-2">
            <AlertTitle className="text-base">
              {result.valid ? 'Doğrulama Başarılı' : 'Doğrulama Başarısız'}
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Durum:</strong> {result.status}</p>
                {result.signatureCount !== undefined && (
                  <p><strong>İmza Sayısı:</strong> {result.signatureCount}</p>
                )}
                {result.verificationTime && (
                  <p><strong>Doğrulama Zamanı:</strong> {new Date(result.verificationTime).toLocaleString('tr-TR')}</p>
                )}
                
                {result.signatures && result.signatures.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold mb-2">İmza Detayları:</p>
                    {result.signatures.map((sig, idx) => (
                      <div key={idx} className="ml-4 mb-2 p-2 bg-white/50 dark:bg-black/20 rounded">
                        <p className="text-sm">
                          <strong>İmza #{idx + 1}:</strong>
                        </p>
                        {sig.signerName && <p className="text-sm">İmzalayan: {sig.signerName}</p>}
                        {sig.signingTime && <p className="text-sm">İmza Zamanı: {new Date(sig.signingTime).toLocaleString('tr-TR')}</p>}
                        {sig.signatureLevel && <p className="text-sm">Seviye: {sig.signatureLevel}</p>}
                        <div className="flex gap-2 mt-1">
                          {sig.valid !== undefined && (
                            <Badge variant={sig.valid ? 'success' : 'destructive'} className="text-xs">
                              İmza: {sig.valid ? 'Geçerli' : 'Geçersiz'}
                            </Badge>
                          )}
                          {sig.certificateValid !== undefined && (
                            <Badge variant={sig.certificateValid ? 'success' : 'destructive'} className="text-xs">
                              Sertifika: {sig.certificateValid ? 'Geçerli' : 'Geçersiz'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-red-600 dark:text-red-400">Hatalar:</p>
                    <ul className="list-disc list-inside text-sm ml-2">
                      {result.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400">Uyarılar:</p>
                    <ul className="list-disc list-inside text-sm ml-2">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  };

  // Render Timestamp Result
  const renderTimestampResult = (result: TimestampVerificationResult | null) => {
    if (!result) return null;

    return (
      <Alert className={result.valid ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
        <div className="flex items-start gap-3">
          {result.valid ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          )}
          <div className="flex-1 space-y-2">
            <AlertTitle className="text-base">
              {result.valid ? 'Zaman Damgası Geçerli' : 'Zaman Damgası Geçersiz'}
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Durum:</strong> {result.status}</p>
                {result.timestampTime && (
                  <p><strong>Zaman Damgası:</strong> {new Date(result.timestampTime).toLocaleString('tr-TR')}</p>
                )}
                {result.tsaName && (
                  <p><strong>TSA:</strong> {result.tsaName}</p>
                )}
                {result.digestAlgorithm && (
                  <p><strong>Algoritma:</strong> {result.digestAlgorithm}</p>
                )}
                {result.verificationTime && (
                  <p><strong>Doğrulama Zamanı:</strong> {new Date(result.verificationTime).toLocaleString('tr-TR')}</p>
                )}

                {result.tsaCertificate && (
                  <div className="mt-3">
                    <p className="font-semibold mb-1">TSA Sertifikası:</p>
                    <div className="ml-4 text-sm">
                      {result.tsaCertificate.subjectDN && <p>DN: {result.tsaCertificate.subjectDN}</p>}
                      {result.tsaCertificate.notBefore && (
                        <p>Geçerlilik Başlangıcı: {new Date(result.tsaCertificate.notBefore).toLocaleString('tr-TR')}</p>
                      )}
                      {result.tsaCertificate.notAfter && (
                        <p>Geçerlilik Bitişi: {new Date(result.tsaCertificate.notAfter).toLocaleString('tr-TR')}</p>
                      )}
                    </div>
                  </div>
                )}

                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-red-600 dark:text-red-400">Hatalar:</p>
                    <ul className="list-disc list-inside text-sm ml-2">
                      {result.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  };

  // Auto-clear previous state on unmount
  useEffect(() => {
    return () => {
      verifyPDF.reset();
      verifyXML.reset();
      verifyTimestamp.reset();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">İmza Doğrulama</h1>
        <p className="mt-2 text-muted-foreground">
          PDF, XML belgelerindeki dijital imzaları ve zaman damgalarını doğrulayın
        </p>
      </div>

      {/* Info Badges */}
      <Card className="border-blue-500/50">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <FileText className="h-3.5 w-3.5" />
              PAdES (PDF)
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <FileCode className="h-3.5 w-3.5" />
              XAdES (XML)
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              RFC 3161 (Timestamp)
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sertifika Doğrulama
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pdf" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14">
          <TabsTrigger value="pdf" className="gap-2 py-3">
            <FileText className="h-4 w-4" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="xml" className="gap-2 py-3">
            <FileCode className="h-4 w-4" />
            XML
          </TabsTrigger>
          <TabsTrigger value="timestamp" className="gap-2 py-3">
            <Clock className="h-4 w-4" />
            Zaman Damgası
          </TabsTrigger>
        </TabsList>

        {/* PDF Tab */}
        <TabsContent value="pdf" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* PDF Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    PDF Doğrulama (PAdES)
                  </CardTitle>
                  <CardDescription>
                    İmzalı PDF belgelerini doğrulayın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePDFSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pdf-file">İmzalı PDF Dosyası</Label>
                      <Input
                        id="pdf-file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          setPdfFile(e.target.files?.[0] || null);
                          setPdfResult(null);
                        }}
                        required
                      />
                      {pdfFile && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pdf-level">Doğrulama Seviyesi</Label>
                      <Select value={pdfLevel} onValueChange={(value) => setPdfLevel(value as VerificationLevel)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seviye seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={VerificationLevel.SIMPLE}>Basit (Hızlı)</SelectItem>
                          <SelectItem value={VerificationLevel.COMPREHENSIVE}>Kapsamlı (Detaylı)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!pdfFile || verifyPDF.isPending}
                    >
                      {verifyPDF.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      PDF Doğrula
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* PDF Result */}
              {pdfResult && (
                <div>{renderVerificationResult(pdfResult)}</div>
              )}
            </div>

            {/* PDF Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  PAdES Doğrulama Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">PAdES Doğrulama</strong>
                  </p>
                  <p>
                    İmzalı PDF belgelerindeki dijital imzaları ETSI standardına göre doğrular.
                    İmza geçerliliği, sertifika zinciri ve zaman damgası kontrolü yapar.
                  </p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Kontroller:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        İmza Geçerliliği
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Sertifika Zinciri
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        OCSP/CRL
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Zaman Damgası
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-200">
                      <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                      <strong>Not:</strong> Basit doğrulama sadece imza geçerliliğini kontrol eder.
                      Kapsamlı doğrulama tüm kontrolleri yapar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* XML Tab */}
        <TabsContent value="xml" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* XML Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    XML Doğrulama (XAdES)
                  </CardTitle>
                  <CardDescription>
                    İmzalı XML belgelerini doğrulayın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleXMLSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="xml-file">İmzalı XML Dosyası</Label>
                      <Input
                        id="xml-file"
                        type="file"
                        accept=".xml"
                        onChange={(e) => {
                          setXmlFile(e.target.files?.[0] || null);
                          setXmlResult(null);
                        }}
                        required
                      />
                      {xmlFile && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {xmlFile.name} ({(xmlFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="xml-original">Orijinal Dosya (Detached imza için opsiyonel)</Label>
                      <Input
                        id="xml-original"
                        type="file"
                        accept=".xml"
                        onChange={(e) => setXmlOriginalFile(e.target.files?.[0] || null)}
                      />
                      {xmlOriginalFile && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {xmlOriginalFile.name} ({(xmlOriginalFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="xml-level">Doğrulama Seviyesi</Label>
                      <Select value={xmlLevel} onValueChange={(value) => setXmlLevel(value as VerificationLevel)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seviye seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={VerificationLevel.SIMPLE}>Basit (Hızlı)</SelectItem>
                          <SelectItem value={VerificationLevel.COMPREHENSIVE}>Kapsamlı (Detaylı)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!xmlFile || verifyXML.isPending}
                    >
                      {verifyXML.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      XML Doğrula
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* XML Result */}
              {xmlResult && (
                <div>{renderVerificationResult(xmlResult)}</div>
              )}
            </div>

            {/* XML Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  XAdES Doğrulama Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">XAdES Doğrulama</strong>
                  </p>
                  <p>
                    İmzalı XML belgelerindeki dijital imzaları ETSI standardına göre doğrular.
                    e-Fatura, e-Arşiv gibi belgelerde kullanılır.
                  </p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Desteklenen Formatlar:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">e-Fatura (UBL)</Badge>
                      <Badge variant="outline">e-Arşiv</Badge>
                      <Badge variant="outline">e-İrsaliye</Badge>
                      <Badge variant="outline">Enveloped</Badge>
                      <Badge variant="outline">Detached</Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-200">
                      <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                      <strong>Not:</strong> DSS otomatik olarak imza tipini tespit eder.
                      Detached imza için orijinal dosya belirtmek daha güvenilir sonuçlar verir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timestamp Tab */}
        <TabsContent value="timestamp" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Timestamp Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Zaman Damgası Doğrulama
                  </CardTitle>
                  <CardDescription>
                    RFC 3161 uyumlu zaman damgası token'larını doğrulayın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTimestampSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ts-file">Zaman Damgası Dosyası (.tst, .ts)</Label>
                      <Input
                        id="ts-file"
                        type="file"
                        accept=".tst,.ts"
                        onChange={(e) => {
                          setTimestampFile(e.target.files?.[0] || null);
                          setTimestampResult(null);
                        }}
                        required
                      />
                      {timestampFile && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {timestampFile.name} ({(timestampFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ts-original">Orijinal Veri (Message imprint doğrulaması için opsiyonel)</Label>
                      <Input
                        id="ts-original"
                        type="file"
                        onChange={(e) => setTimestampOriginalData(e.target.files?.[0] || null)}
                      />
                      {timestampOriginalData && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {timestampOriginalData.name} ({(timestampOriginalData.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ts-validate-cert"
                        checked={timestampValidateCert}
                        onCheckedChange={(checked) => setTimestampValidateCert(checked as boolean)}
                      />
                      <Label htmlFor="ts-validate-cert" className="cursor-pointer text-sm font-normal">
                        TSA sertifikası doğrulaması yap
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!timestampFile || verifyTimestamp.isPending}
                    >
                      {verifyTimestamp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Zaman Damgası Doğrula
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Timestamp Result */}
              {timestampResult && (
                <div>{renderTimestampResult(timestampResult)}</div>
              )}
            </div>

            {/* Timestamp Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Zaman Damgası Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">RFC 3161 Zaman Damgası</strong>
                  </p>
                  <p>
                    Zaman damgası token'larını doğrular. TSA sertifikası, message imprint 
                    ve zaman damgası geçerliliğini kontrol eder.
                  </p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Kontroller:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Token Geçerliliği
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        TSA Sertifikası
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Message Imprint
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Zaman Kontrolü
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-200">
                      <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                      <strong>Not:</strong> Orijinal veri belirtirseniz message imprint doğrulaması da yapılır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

