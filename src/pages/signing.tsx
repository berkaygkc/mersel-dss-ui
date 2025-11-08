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
import { useSignPDF, useSignXML, useSignSOAP, DocumentType } from '@/hooks/use-sign';
import { Loader2, FileText, FileCode, Mail, CheckCircle2, Info } from 'lucide-react';
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

  const signPDF = useSignPDF();
  const signXML = useSignXML();
  const signSOAP = useSignSOAP();

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

  // Auto-clear previous state on unmount
  useEffect(() => {
    return () => {
      signPDF.reset();
      signXML.reset();
      signSOAP.reset();
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
              <Mail className="h-3.5 w-3.5" />
              WS-Security (SOAP)
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              ETSI Standartları
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="xml" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14">
          <TabsTrigger value="xml" className="gap-2 py-3">
            <FileCode className="h-4 w-4" />
            XML
          </TabsTrigger>
          <TabsTrigger value="pdf" className="gap-2 py-3">
            <FileText className="h-4 w-4" />
            PDF
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

