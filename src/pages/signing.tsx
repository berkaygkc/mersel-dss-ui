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
import { useSignPDF, useSignXML, useSignSOAP, useSignCAdES, useSignHash, DocumentType } from '@/hooks/use-sign';
import type { TimestampType } from '@/api/generated';
import { Loader2, FileText, FileCode, Mail, CheckCircle2, Info, FileSignature, Hash, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Example XML content
const EXAMPLE_EFATURA = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
    <cbc:CustomizationID>TR1.2</cbc:CustomizationID>
    <cbc:ProfileID>TICARIFATURA</cbc:ProfileID>
    <cbc:ID>TST2024000000001</cbc:ID>
    <cbc:IssueDate>2024-01-15</cbc:IssueDate>
    <cbc:IssueTime>10:30:00</cbc:IssueTime>
    <cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode>
</Invoice>`;

const EXAMPLE_SOAP_11 = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <ns:TestRequest xmlns:ns="http://example.com/test">
            <ns:message>Test SOAP 1.1 Message</ns:message>
        </ns:TestRequest>
    </soap:Body>
</soap:Envelope>`;

const EXAMPLE_SOAP_12 = `<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
    <env:Body>
        <ns:TestRequest xmlns:ns="http://example.com/test">
            <ns:message>Test SOAP 1.2 Message</ns:message>
        </ns:TestRequest>
    </env:Body>
</env:Envelope>`;

export function SigningPage() {
  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [appendMode, setAppendMode] = useState(false);

  // XML state
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.UBL_DOCUMENT);
  const [zipFile, setZipFile] = useState(false);

  // SOAP state
  const [soapFile, setSoapFile] = useState<File | null>(null);
  const [soap12, setSoap12] = useState(false);

  // CAdES state
  const [cadesContent, setCadesContent] = useState('');
  const [cadesTimestampType, setCadesTimestampType] = useState<TimestampType>('signature');

  // Hash Sign state
  const [hashValue, setHashValue] = useState('');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-256');
  const [signatureResult, setSignatureResult] = useState<{
    signatureValue: string;
    certificate: string;
    certificateChain: string;
    signatureAlgorithm: string;
  } | null>(null);

  const signPDF = useSignPDF();
  const signXML = useSignXML();
  const signSOAP = useSignSOAP();
  const signCAdES = useSignCAdES();
  const signHash = useSignHash();

  // PDF Sign Handler
  const handlePDFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    try {
      const result = await signPDF.mutateAsync({
        document: pdfFile,
        appendMode,
      });

      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF İmzalama Başarılı!', {
        description: `${pdfFile.name} başarıyla imzalandı ve indiriliyor.`,
      });
    } catch (error) {
      toast.error('PDF İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'PDF imzalama sırasında bir hata oluştu.',
      });
    }
  };

  // XML Sign Handler
  const handleXMLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmlFile) return;

    try {
      const result = await signXML.mutateAsync({
        document: xmlFile,
        documentType,
        zipFile,
      });

      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${xmlFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('XML İmzalama Başarılı!', {
        description: `${xmlFile.name} başarıyla imzalandı ve indiriliyor.`,
      });
    } catch (error) {
      toast.error('XML İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'XML imzalama sırasında bir hata oluştu.',
      });
    }
  };

  // SOAP Sign Handler
  const handleSOAPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soapFile) return;

    try {
      const result = await signSOAP.mutateAsync({
        document: soapFile,
        soap1Dot2: soap12,
      });

      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${soapFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('SOAP İmzalama Başarılı!', {
        description: `${soapFile.name} başarıyla imzalandı ve indiriliyor.`,
      });
    } catch (error) {
      toast.error('SOAP İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'SOAP imzalama sırasında bir hata oluştu.',
      });
    }
  };

  // Load example XML
  const loadXMLExample = () => {
    const blob = new Blob([EXAMPLE_EFATURA], { type: 'application/xml' });
    const file = new File([blob], 'example-invoice.xml', { type: 'application/xml' });
    setXmlFile(file);
  };

  // Load example SOAP
  const loadSOAPExample = () => {
    const example = soap12 ? EXAMPLE_SOAP_12 : EXAMPLE_SOAP_11;
    const blob = new Blob([example], { type: 'application/xml' });
    const file = new File([blob], `example-soap${soap12 ? '12' : '11'}.xml`, { type: 'application/xml' });
    setSoapFile(file);
  };

  // CAdES Sign Handler
  const handleCAdESSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadesContent.trim()) {
      toast.error('İçerik boş olamaz');
      return;
    }

    try {
      const result = await signCAdES.mutateAsync({
        content: cadesContent,
        timestampType: cadesTimestampType,
      });

      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-cades-${Date.now()}.p7s`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('CAdES İmzalama Başarılı!', {
        description: `İçerik başarıyla imzalandı. Zaman damgası: ${cadesTimestampType}`,
      });
    } catch (error) {
      toast.error('CAdES İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'CAdES imzalama sırasında bir hata oluştu.',
      });
    }
  };

  // Hash Sign Handler
  const handleHashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashValue.trim()) {
      toast.error('Hash değeri boş olamaz');
      return;
    }

    try {
      const result = await signHash.mutateAsync({
        hash: hashValue,
        hashAlgorithm,
      });

      setSignatureResult(result);

      toast.success('Hash İmzalama Başarılı!', {
        description: `Hash başarıyla imzalandı. Algoritma: ${result.signatureAlgorithm}`,
      });
    } catch (error) {
      toast.error('Hash İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'Hash imzalama sırasında bir hata oluştu.',
      });
    }
  };

  // Load CAdES example
  const loadCadesExample = () => {
    setCadesContent(`{"id":"EAA2025000000014","cid":"23a1636a-9ae0-4c30-b3f7-2b9dd622af75","type":"EArchiveSent","account":5278,"timestamp":"2025-12-18T15:05:26.266Z"}`);
    toast.info('Örnek içerik yüklendi');
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı`);
  };

  // Auto-clear previous state on unmount
  useEffect(() => {
    return () => {
      signPDF.reset();
      signXML.reset();
      signSOAP.reset();
      signCAdES.reset();
      signHash.reset();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dijital İmzalama</h1>
        <p className="mt-2 text-muted-foreground">
          PDF, XML ve SOAP belgelerinizi dijital olarak imzalayın
        </p>
      </div>

      {/* Info Badges */}
      <Card className="border-violet-500/50">
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
              <Hash className="h-3.5 w-3.5" />
              Hash Sign
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Mail className="h-3.5 w-3.5" />
              WS-Security
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="xml" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-14">
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
          <TabsTrigger value="hash" className="gap-2 py-3">
            <Hash className="h-4 w-4" />
            Hash
          </TabsTrigger>
          <TabsTrigger value="soap" className="gap-2 py-3">
            <Mail className="h-4 w-4" />
            SOAP
          </TabsTrigger>
        </TabsList>

        {/* PDF Tab */}
        <TabsContent value="pdf" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* PDF Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  PDF İmzalama (PAdES)
                </CardTitle>
                <CardDescription>
                  PDF belgelerinizi dijital olarak imzalayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePDFSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-file">PDF Dosyası</Label>
                    <Input
                      id="pdf-file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      required
                    />
                    {pdfFile && (
                      <p className="text-xs text-muted-foreground">
                        Seçilen: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="append-mode"
                      checked={appendMode}
                      onCheckedChange={(checked) => setAppendMode(checked as boolean)}
                    />
                    <Label htmlFor="append-mode" className="cursor-pointer text-sm font-normal">
                      Append Mode (Mevcut imzaların üzerine ekle)
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!pdfFile || signPDF.isPending}
                  >
                    {signPDF.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    PDF İmzala
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* PDF Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  PAdES Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">PAdES (PDF Advanced Electronic Signatures)</strong>
                  </p>
                  <p>
                    PDF belgelerine ETSI standardına uygun dijital imza ekler.
                    İmzalanan PDF'ler Adobe Acrobat gibi standart PDF okuyucularında doğrulanabilir.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Görsel İmza
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Çoklu İmza
                    </Badge>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  XML İmzalama (XAdES)
                </CardTitle>
                <CardDescription>
                  e-Fatura, e-Arşiv ve diğer XML belgelerinizi imzalayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleXMLSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Belge Tipi</Label>
                    <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Belge tipini seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DocumentType.UBL_DOCUMENT}>e-Fatura / UBL Belge</SelectItem>
                        <SelectItem value={DocumentType.EARCHIVE_REPORT}>e-Arşiv Raporu</SelectItem>
                        <SelectItem value={DocumentType.HR_XML}>HrXml</SelectItem>
                        <SelectItem value={DocumentType.OTHER_XML_DOCUMENT}>Diğer XML</SelectItem>
                        <SelectItem value={DocumentType.NONE}>None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="xml-file">XML Dosyası</Label>
                    <div className="flex gap-2">
                      <Input
                        id="xml-file"
                        type="file"
                        accept=".xml"
                        onChange={(e) => setXmlFile(e.target.files?.[0] || null)}
                        required
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={loadXMLExample}>
                        Örnek
                      </Button>
                    </div>
                    {xmlFile && (
                      <p className="text-xs text-muted-foreground">
                        Seçilen: {xmlFile.name} ({(xmlFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="zip-file"
                      checked={zipFile}
                      onCheckedChange={(checked) => setZipFile(checked as boolean)}
                    />
                    <Label htmlFor="zip-file" className="cursor-pointer text-sm font-normal">
                      ZIP olarak indir
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!xmlFile || signXML.isPending}
                  >
                    {signXML.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    XML İmzala
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* XML Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  XAdES Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">XAdES (XML Advanced Electronic Signatures)</strong>
                  </p>
                  <p>
                    XML belgelerine ETSI standardına uygun dijital imza ekler.
                    e-Fatura sisteminde kullanılır.
                  </p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Desteklenen Formatlar:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">e-Fatura (UBL)</Badge>
                      <Badge variant="outline">e-Arşiv</Badge>
                      <Badge variant="outline">e-İrsaliye</Badge>
                      <Badge variant="outline">HrXml</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CAdES Tab */}
        <TabsContent value="cades" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature className="h-5 w-5" />
                  CAdES İmzalama
                </CardTitle>
                <CardDescription>
                  Metin içeriğini CAdES formatında imzalayın (.p7s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCAdESSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cades-content">İçerik</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={loadCadesExample}>
                        Örnek Yükle
                      </Button>
                    </div>
                    <Textarea
                      id="cades-content"
                      placeholder="İmzalanacak metin içeriğini buraya yapıştırın..."
                      value={cadesContent}
                      onChange={(e) => setCadesContent(e.target.value)}
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Zaman Damgası Türü</Label>
                    <Select value={cadesTimestampType} onValueChange={(v) => setCadesTimestampType(v as TimestampType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Yok (CAdES-B)</SelectItem>
                        <SelectItem value="signature">İmza ZD (CAdES-T)</SelectItem>
                        <SelectItem value="archive">Arşiv ZD (CAdES-A)</SelectItem>
                        <SelectItem value="all">Tümü</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={signCAdES.isPending || !cadesContent.trim()}>
                    {signCAdES.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    CAdES İmzala
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  CAdES Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">CAdES (CMS Advanced Electronic Signatures)</strong></p>
                  <p>Metin içeriğini PKCS#7/CMS formatında imzalar. Audit logları ve diğer metin verilerinin imzalanması için idealdir.</p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Zaman Damgası Seviyeleri:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">CAdES-B (Temel)</Badge>
                      <Badge variant="outline">CAdES-T (İmza ZD)</Badge>
                      <Badge variant="outline">CAdES-A (Arşiv ZD)</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hash Tab */}
        <TabsContent value="hash" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Hash İmzalama
                </CardTitle>
                <CardDescription>
                  Client tarafında hesaplanan hash değerini imzalayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHashSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hash-value">Hash Değeri (Base64)</Label>
                    <Textarea
                      id="hash-value"
                      placeholder="Base64 encoded hash değerini buraya yapıştırın..."
                      value={hashValue}
                      onChange={(e) => setHashValue(e.target.value)}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hash Algoritması</Label>
                    <Select value={hashAlgorithm} onValueChange={setHashAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHA-256">SHA-256 (Önerilen)</SelectItem>
                        <SelectItem value="SHA-384">SHA-384</SelectItem>
                        <SelectItem value="SHA-512">SHA-512</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={signHash.isPending || !hashValue.trim()}>
                    {signHash.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Hash İmzala
                  </Button>
                </form>

                {signatureResult && (
                  <div className="mt-4 space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Başarılı</Badge>
                      <span className="text-xs text-muted-foreground">{signatureResult.signatureAlgorithm}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">İmza Değeri</Label>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(signatureResult.signatureValue, 'İmza değeri')}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea value={signatureResult.signatureValue} readOnly className="min-h-[60px] font-mono text-xs" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Sertifika (Base64)</Label>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(signatureResult.certificate, 'Sertifika')}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea value={signatureResult.certificate} readOnly className="min-h-[60px] font-mono text-xs" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Hash İmzalama Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Hash İmzalama (Remote Signing)</strong></p>
                  <p>Client tarafında hesaplanan hash değerini imzalar. XAdES remote signing ve benzeri senaryolar için idealdir.</p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Dönen Değerler:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">İmza Değeri</Badge>
                      <Badge variant="outline">Sertifika</Badge>
                      <Badge variant="outline">Sertifika Zinciri</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SOAP Tab */}
        <TabsContent value="soap" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* SOAP Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  SOAP İmzalama (WS-Security)
                </CardTitle>
                <CardDescription>
                  SOAP mesajlarınızı WS-Security ile imzalayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSOAPSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="soap12"
                      checked={soap12}
                      onCheckedChange={(checked) => setSoap12(checked as boolean)}
                    />
                    <Label htmlFor="soap12" className="cursor-pointer text-sm font-normal">
                      SOAP 1.2 (varsayılan: SOAP 1.1)
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soap-file">SOAP XML Dosyası</Label>
                    <div className="flex gap-2">
                      <Input
                        id="soap-file"
                        type="file"
                        accept=".xml"
                        onChange={(e) => setSoapFile(e.target.files?.[0] || null)}
                        required
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={loadSOAPExample}>
                        Örnek
                      </Button>
                    </div>
                    {soapFile && (
                      <p className="text-xs text-muted-foreground">
                        Seçilen: {soapFile.name} ({(soapFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!soapFile || signSOAP.isPending}
                  >
                    {signSOAP.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    SOAP İmzala
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* SOAP Info */}
            <Card className="border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  WS-Security Hakkında
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">WS-Security (Web Services Security)</strong>
                  </p>
                  <p>
                    SOAP mesajlarına XML Signature standardına uygun güvenlik başlıkları ekler.
                  </p>
                  <div className="mt-3">
                    <p className="font-medium text-foreground mb-2">Özellikler:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">SOAP 1.1</Badge>
                      <Badge variant="outline">SOAP 1.2</Badge>
                      <Badge variant="outline">Security Header</Badge>
                      <Badge variant="outline">B2B Entegrasyon</Badge>
                    </div>
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

