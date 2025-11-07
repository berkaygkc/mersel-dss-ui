import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSignXML } from '@/hooks/use-sign';
import { DocumentType } from '@/api/generated';
import { Loader2, FileCode, CheckCircle, AlertCircle, Download } from 'lucide-react';

const EXAMPLE_EFATURA = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <!-- e-Fatura XML içeriği buraya gelir -->
</Invoice>`;

export function XMLSignPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.UBL_DOCUMENT);
  const [zipFile, setZipFile] = useState(false);

  const signXML = useSignXML();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    try {
      const result = await signXML.mutateAsync({
        document: selectedFile,
        documentType,
        zipFile,
      });
      
      // Auto-download signed XML
      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Sign error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const loadExample = () => {
    const blob = new Blob([EXAMPLE_EFATURA], { type: 'application/xml' });
    const file = new File([blob], 'example-invoice.xml', { type: 'application/xml' });
    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">XML İmzalama (XAdES)</h1>
        <p className="mt-2 text-slate-600">
          XML belgelerinizi dijital olarak imzalayın (e-Fatura, e-Arşiv, vb.)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              XML Belgesi
            </CardTitle>
            <CardDescription>
              İmzalanacak XML dosyasını yükleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="document-type">Belge Tipi</Label>
                <select
                  id="document-type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value={DocumentType.UBL_DOCUMENT}>e-Fatura / UBL Belge</option>
                  <option value={DocumentType.EARCHIVE_REPORT}>e-Arşiv Raporu</option>
                  <option value={DocumentType.HR_XML}>HrXml</option>
                  <option value={DocumentType.OTHER_XML_DOCUMENT}>Diğer XML</option>
                  <option value={DocumentType.NONE}>None</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="xml-file">XML Dosyası</Label>
                <div className="flex gap-2">
                  <Input
                    id="xml-file"
                    type="file"
                    accept=".xml"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={loadExample}>
                    Örnek
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-xs text-slate-600">
                    Seçilen: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Zip File */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="zip-file"
                  checked={zipFile}
                  onChange={(e) => setZipFile(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="zip-file" className="cursor-pointer">
                  ZIP olarak indir
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={signXML.isPending || !selectedFile}
              >
                {signXML.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    İmzalanıyor...
                  </>
                ) : (
                  <>
                    <FileCode className="mr-2 h-4 w-4" />
                    XML İmzala
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="space-y-6">
          {/* Success */}
          {signXML.isSuccess && (
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Başarılı!</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <p>XML belgesi başarıyla imzalandı ve indirildi.</p>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">İmzalı dosya indiriliyor...</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error */}
          {signXML.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata!</AlertTitle>
              <AlertDescription>
                {(signXML.error as any)?.body?.message ||
                  (signXML.error as any)?.message ||
                  'XML imzalama sırasında bir hata oluştu.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>XAdES ve e-Fatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">Desteklenen Formatlar:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>e-Fatura (UBL Invoice)</li>
                  <li>e-Arşiv Fatura</li>
                  <li>Uygulama Yanıtı</li>
                  <li>e-İrsaliye (DespatchAdvice)</li>
                  <li>HrXml</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-900">XAdES İmza:</p>
                <p className="mt-1">
                  XML belgelerine ETSI standardına uygun dijital imza ekler.
                  e-Fatura sisteminde kullanılır.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
