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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  useVerifyPDF, 
  useVerifyXML, 
  useVerifyTimestamp,
  useVerifyCAdES,
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
  ShieldCheck,
  X,
  FileSignature
} from 'lucide-react';
import { toast } from 'sonner';

export function VerifyPage() {
  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfLevel, setPdfLevel] = useState<VerificationLevel>(VerificationLevel.SIMPLE);
  const [pdfResult, setPdfResult] = useState<VerificationResult | null>(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

  // XML state
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlOriginalFile, setXmlOriginalFile] = useState<File | null>(null);
  const [xmlLevel, setXmlLevel] = useState<VerificationLevel>(VerificationLevel.SIMPLE);
  const [xmlResult, setXmlResult] = useState<VerificationResult | null>(null);
  const [xmlDialogOpen, setXmlDialogOpen] = useState(false);

  // Timestamp state
  const [timestampFile, setTimestampFile] = useState<File | null>(null);
  const [timestampOriginalData, setTimestampOriginalData] = useState<File | null>(null);
  const [timestampValidateCert, setTimestampValidateCert] = useState(true);
  const [timestampResult, setTimestampResult] = useState<TimestampVerificationResult | null>(null);
  const [timestampDialogOpen, setTimestampDialogOpen] = useState(false);

  // CAdES state
  const [cadesFile, setCadesFile] = useState<File | null>(null);
  const [cadesOriginalFile, setCadesOriginalFile] = useState<File | null>(null);
  const [cadesLevel, setCadesLevel] = useState<VerificationLevel>(VerificationLevel.SIMPLE);
  const [cadesResult, setCadesResult] = useState<VerificationResult | null>(null);
  const [cadesDialogOpen, setCadesDialogOpen] = useState(false);

  const verifyPDF = useVerifyPDF();
  const verifyXML = useVerifyXML();
  const verifyTimestamp = useVerifyTimestamp();
  const verifyCAdES = useVerifyCAdES();

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
      setPdfDialogOpen(true); // Modal'ı aç

      if (result.valid) {
        toast.success('PDF Doğrulama Başarılı!', {
          description: `${pdfFile.name} doğrulandı. İmza geçerli.`,
        });
      } else {
        toast.warning('PDF Doğrulama Tamamlandı', {
          description: 'İmza geçersiz veya sorunlar tespit edildi.',
        });
      }
      
      // İşlem tamamlandı, dosya seçimini temizle
      setPdfFile(null);
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
      setXmlDialogOpen(true); // Modal'ı aç

      if (result.valid) {
        toast.success('XML Doğrulama Başarılı!', {
          description: `${xmlFile.name} doğrulandı. İmza geçerli.`,
        });
      } else {
        toast.warning('XML Doğrulama Tamamlandı', {
          description: 'İmza geçersiz veya sorunlar tespit edildi.',
        });
      }
      
      // İşlem tamamlandı, dosya seçimlerini temizle
      setXmlFile(null);
      setXmlOriginalFile(null);
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
      setTimestampDialogOpen(true); // Modal'ı aç

      if (result.valid) {
        toast.success('Zaman Damgası Doğrulama Başarılı!', {
          description: `${timestampFile.name} doğrulandı. Geçerli.`,
        });
      } else {
        toast.warning('Zaman Damgası Doğrulama Tamamlandı', {
          description: 'Zaman damgası geçersiz veya sorunlar tespit edildi.',
        });
      }
      
      // İşlem tamamlandı, dosya seçimlerini temizle
      setTimestampFile(null);
      setTimestampOriginalData(null);
    } catch (error) {
      toast.error('Zaman Damgası Doğrulama Hatası!', {
        description: (error as any)?.message || 'Zaman damgası doğrulama sırasında bir hata oluştu.',
      });
      setTimestampResult(null);
    }
  };

  // CAdES Verify Handler
  const handleCAdESSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadesFile) return;

    try {
      const result = await verifyCAdES.mutateAsync({
        signedDocument: cadesFile,
        originalDocument: cadesOriginalFile || undefined,
        level: cadesLevel,
      });

      setCadesResult(result);
      setCadesDialogOpen(true);

      if (result.valid) {
        toast.success('CAdES Doğrulama Başarılı!', {
          description: `${cadesFile.name} doğrulandı. İmza geçerli.`,
        });
      } else {
        toast.warning('CAdES Doğrulama Tamamlandı', {
          description: 'İmza geçersiz veya sorunlar tespit edildi.',
        });
      }
      
      setCadesFile(null);
      setCadesOriginalFile(null);
    } catch (error) {
      toast.error('CAdES Doğrulama Hatası!', {
        description: (error as any)?.message || 'CAdES doğrulama sırasında bir hata oluştu.',
      });
      setCadesResult(null);
    }
  };

  // Render Verification Result (for modal)
  const renderVerificationResult = (result: VerificationResult | null) => {
    if (!result) return null;

    return (
      <div className="space-y-4">
        {/* Genel Bilgiler */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {result.signatureType && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground/60 mb-1.5">İmza Tipi</p>
              <p className="text-sm font-semibold text-foreground">{result.signatureType}</p>
            </div>
          )}
          {result.signatureCount !== undefined && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground/60 mb-1.5">İmza Sayısı</p>
              <p className="text-sm font-semibold text-foreground">{result.signatureCount}</p>
            </div>
          )}
          {result.verificationTime && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground/60 mb-1.5">Doğrulama Zamanı</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(result.verificationTime).toLocaleString('tr-TR')}
              </p>
            </div>
          )}
        </div>

        {/* İmza Detayları */}
        {result.signatures && result.signatures.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">İmza Detayları</h3>
            {result.signatures.map((sig, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">İmza #{idx + 1}</p>
                  <Badge variant={sig.valid ? 'default' : 'destructive'}>
                    {sig.valid ? 'Geçerli' : 'Geçersiz'}
                  </Badge>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  {sig.signatureLevel && (
                    <div>
                      <span className="text-xs text-foreground/60">Seviye: </span>
                      <span className="text-sm font-medium">{sig.signatureLevel}</span>
                    </div>
                  )}
                  {sig.signatureFormat && (
                    <div>
                      <span className="text-xs text-foreground/60">Format: </span>
                      <span className="text-sm font-medium">{sig.signatureFormat}</span>
                    </div>
                  )}
                  {sig.signingTime && (
                    <div>
                      <span className="text-xs text-foreground/60">İmza Zamanı: </span>
                      <span className="text-sm font-medium">
                        {new Date(sig.signingTime).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}
                  {sig.signatureAlgorithm && (
                    <div>
                      <span className="text-xs text-foreground/60">İmza Algoritması: </span>
                      <span className="text-sm font-medium">{sig.signatureAlgorithm}</span>
                    </div>
                  )}
                </div>

                {/* Sertifika Bilgisi */}
                {sig.signerCertificate && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-foreground/60 mb-2">İmzalayan Sertifikası</p>
                    <div className="space-y-1 text-sm">
                      {sig.signerCertificate.commonName && (
                        <p><span className="text-foreground/60">İsim:</span> {sig.signerCertificate.commonName}</p>
                      )}
                      {sig.signerCertificate.serialNumber && (
                        <p className="font-mono text-xs"><span className="text-foreground/60">Seri No:</span> {sig.signerCertificate.serialNumber}</p>
                      )}
                      {sig.signerCertificate.notAfter && (
                        <p><span className="text-foreground/60">Geçerlilik:</span> {new Date(sig.signerCertificate.notAfter).toLocaleDateString('tr-TR')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Zaman Damgaları */}
                {sig.timestamps && sig.timestamps.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-foreground/60 mb-2">
                      Zaman Damgaları ({sig.timestamps.length} adet)
                    </p>
                    <div className="space-y-2">
                      {sig.timestamps.map((ts, tsIdx) => (
                        <div key={tsIdx} className="rounded-lg border border-border bg-muted/20 p-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Zaman Damgası #{tsIdx + 1}</span>
                            <Badge variant={ts.valid ? 'default' : 'destructive'} className="text-xs">
                              {ts.valid ? 'Geçerli' : 'Geçersiz'}
                            </Badge>
                          </div>
                          {ts.timestampType && (
                            <p className="text-xs"><span className="text-foreground/60">Tip:</span> {ts.timestampType}</p>
                          )}
                          {ts.timestampTime && (
                            <p className="text-xs">
                              <span className="text-foreground/60">Zaman:</span>{' '}
                              {new Date(ts.timestampTime).toLocaleString('tr-TR')}
                            </p>
                          )}
                          {ts.tsaName && (
                            <p className="text-xs"><span className="text-foreground/60">TSA:</span> {ts.tsaName}</p>
                          )}
                          {ts.digestAlgorithm && (
                            <p className="text-xs"><span className="text-foreground/60">Algoritma:</span> {ts.digestAlgorithm}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {sig.validationErrors && sig.validationErrors.length > 0 && (
                  <div className="rounded-lg border-2 border-red-500/60 bg-red-500/5 dark:bg-red-500/10 p-3">
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">Hatalar:</p>
                    <ul className="space-y-1">
                      {sig.validationErrors.map((error, i) => (
                        <li key={i} className="text-xs text-foreground/90 flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Global Errors */}
        {result.errors && result.errors.length > 0 && (
          <div className="rounded-lg border-2 border-red-500/60 bg-red-500/5 dark:bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Doğrulama Hataları
            </p>
            <ul className="space-y-2">
              {result.errors.map((error, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="text-red-600 dark:text-red-400 mt-0.5 font-bold">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Global Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="rounded-lg border-2 border-orange-500/60 bg-orange-500/5 dark:bg-orange-500/10 p-4">
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Uyarılar
            </p>
            <ul className="space-y-2">
              {result.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5 font-bold">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Render Timestamp Result (for modal)
  const renderTimestampResult = (result: TimestampVerificationResult | null) => {
    if (!result) return null;

    return (
      <div className="space-y-4">
        {/* Genel Bilgiler */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {result.timestampTime && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground/60 mb-1.5">Zaman Damgası</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(result.timestampTime).toLocaleString('tr-TR', {
                  dateStyle: 'full',
                  timeStyle: 'medium'
                })}
              </p>
            </div>
          )}
          {result.digestAlgorithm && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground/60 mb-1.5">Digest Algoritması</p>
              <p className="text-sm font-semibold text-foreground">{result.digestAlgorithm}</p>
            </div>
          )}
          {result.verificationTime && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground/60 mb-1.5">Doğrulama Zamanı</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(result.verificationTime).toLocaleString('tr-TR')}
              </p>
            </div>
          )}
        </div>

        {/* TSA Information */}
        {result.tsaName && (
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-bold text-foreground mb-2">Zaman Damgası Otoritesi (TSA)</p>
            <p className="text-sm font-mono text-foreground/90 break-all">{result.tsaName}</p>
          </div>
        )}

        {/* TSA Sertifikası */}
        {result.tsaCertificate && (
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-bold text-foreground mb-3">TSA Sertifikası</p>
            <div className="space-y-2 text-sm">
              {result.tsaCertificate.commonName && (
                <p><span className="text-foreground/60">İsim:</span> {result.tsaCertificate.commonName}</p>
              )}
              {result.tsaCertificate.subject && (
                <p className="font-mono text-xs"><span className="text-foreground/60">Subject:</span> {result.tsaCertificate.subject}</p>
              )}
              {result.tsaCertificate.serialNumber && (
                <p className="font-mono text-xs"><span className="text-foreground/60">Seri No:</span> {result.tsaCertificate.serialNumber}</p>
              )}
              <div className="grid gap-2 md:grid-cols-2 mt-2">
                {result.tsaCertificate.notBefore && (
                  <div>
                    <span className="text-xs text-foreground/60">Geçerlilik Başlangıcı: </span>
                    <span className="text-sm font-medium">
                      {new Date(result.tsaCertificate.notBefore).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                {result.tsaCertificate.notAfter && (
                  <div>
                    <span className="text-xs text-foreground/60">Geçerlilik Bitişi: </span>
                    <span className="text-sm font-medium">
                      {new Date(result.tsaCertificate.notAfter).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Imprint */}
        {result.messageImprint && (
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-bold text-foreground mb-2">Message Imprint</p>
            <p className="text-xs font-mono text-foreground/80 break-all">{result.messageImprint}</p>
          </div>
        )}

        {/* Errors */}
        {result.errors && result.errors.length > 0 && (
          <div className="rounded-lg border-2 border-red-500/60 bg-red-500/5 dark:bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Doğrulama Hataları
            </p>
            <ul className="space-y-2">
              {result.errors.map((error, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="text-red-600 dark:text-red-400 mt-0.5 font-bold">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="rounded-lg border-2 border-orange-500/60 bg-orange-500/5 dark:bg-orange-500/10 p-4">
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Uyarılar
            </p>
            <ul className="space-y-2">
              {result.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5 font-bold">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Auto-clear previous state on unmount
  useEffect(() => {
    return () => {
      verifyPDF.reset();
      verifyXML.reset();
      verifyTimestamp.reset();
      verifyCAdES.reset();
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
              <FileSignature className="h-3.5 w-3.5" />
              CAdES (.p7s)
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

      <Tabs defaultValue="xml" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14">
          <TabsTrigger value="xml" className="gap-2 py-3">
            <FileCode className="h-4 w-4" />
            XML
          </TabsTrigger>
          <TabsTrigger value="pdf" className="gap-2 py-3">
            <FileText className="h-4 w-4" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="cades" className="gap-2 py-3">
            <FileSignature className="h-4 w-4" />
            CAdES
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

        {/* CAdES Tab */}
        <TabsContent value="cades" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* CAdES Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSignature className="h-5 w-5" />
                    CAdES Doğrulama
                  </CardTitle>
                  <CardDescription>
                    CAdES imzalı dosyaları (.p7s) doğrulayın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCAdESSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cades-file">İmzalı Dosya (.p7s)</Label>
                      <Input
                        id="cades-file"
                        type="file"
                        accept=".p7s,.p7m"
                        onChange={(e) => {
                          setCadesFile(e.target.files?.[0] || null);
                          setCadesResult(null);
                        }}
                        required
                      />
                      {cadesFile && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {cadesFile.name} ({(cadesFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cades-original">Orijinal Dosya (Detached imza için opsiyonel)</Label>
                      <Input
                        id="cades-original"
                        type="file"
                        onChange={(e) => setCadesOriginalFile(e.target.files?.[0] || null)}
                      />
                      {cadesOriginalFile && (
                        <p className="text-xs text-muted-foreground">
                          Seçilen: {cadesOriginalFile.name} ({(cadesOriginalFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cades-level">Doğrulama Seviyesi</Label>
                      <Select value={cadesLevel} onValueChange={(value) => setCadesLevel(value as VerificationLevel)}>
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
                      disabled={!cadesFile || verifyCAdES.isPending}
                    >
                      {verifyCAdES.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      CAdES Doğrula
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* CAdES Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  CAdES Doğrulama Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">CAdES Doğrulama</strong>
                  </p>
                  <p>
                    CAdES (CMS Advanced Electronic Signatures) formatındaki imzaları doğrular.
                    Audit logları ve diğer metin içeriklerinin imzalarını kontrol eder.
                  </p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Desteklenen Seviyeler:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">CAdES-BES</Badge>
                      <Badge variant="outline">CAdES-T</Badge>
                      <Badge variant="outline">CAdES-C</Badge>
                      <Badge variant="outline">CAdES-A (LTA)</Badge>
                    </div>
                  </div>
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
                        Zaman Damgası
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-200">
                      <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                      <strong>Not:</strong> Detached imza için orijinal dosyayı da yüklemeniz gerekir.
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

      {/* PDF Verification Result Modal */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] [&>button]:hidden p-0 gap-0">
          {pdfResult && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPdfDialogOpen(false)}
                  className="absolute right-6 top-6 h-8 w-8 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-xl pr-12 ${pdfResult.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {pdfResult.valid ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        PDF İmza Geçerli
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        PDF İmza Geçersiz
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {pdfResult.status}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderVerificationResult(pdfResult)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* XML Verification Result Modal */}
      <Dialog open={xmlDialogOpen} onOpenChange={setXmlDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] [&>button]:hidden p-0 gap-0">
          {xmlResult && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setXmlDialogOpen(false)}
                  className="absolute right-6 top-6 h-8 w-8 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-xl pr-12 ${xmlResult.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {xmlResult.valid ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        XML İmza Geçerli
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        XML İmza Geçersiz
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {xmlResult.status}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderVerificationResult(xmlResult)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Timestamp Verification Result Modal */}
      <Dialog open={timestampDialogOpen} onOpenChange={setTimestampDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] [&>button]:hidden p-0 gap-0">
          {timestampResult && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setTimestampDialogOpen(false)}
                  className="absolute right-6 top-6 h-8 w-8 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-xl pr-12 ${timestampResult.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {timestampResult.valid ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        Zaman Damgası Geçerli
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        Zaman Damgası Geçersiz
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {timestampResult.status}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderTimestampResult(timestampResult)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CAdES Verification Result Modal */}
      <Dialog open={cadesDialogOpen} onOpenChange={setCadesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] [&>button]:hidden p-0 gap-0">
          {cadesResult && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setCadesDialogOpen(false)}
                  className="absolute right-6 top-6 h-8 w-8 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-xl pr-12 ${cadesResult.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {cadesResult.valid ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        CAdES İmza Geçerli
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        CAdES İmza Geçersiz
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {cadesResult.status}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderVerificationResult(cadesResult)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

