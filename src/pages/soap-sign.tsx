import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignSOAP } from '@/hooks/use-sign';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const EXAMPLE_SOAP_11 = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header/>
  <soap:Body>
    <MyRequest>
      <param1>value1</param1>
    </MyRequest>
  </soap:Body>
</soap:Envelope>`;

const EXAMPLE_SOAP_12 = `<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
  <env:Header/>
  <env:Body>
    <MyRequest>
      <param1>value1</param1>
    </MyRequest>
  </env:Body>
</env:Envelope>`;

export function SOAPSignPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [soap12, setSoap12] = useState(false);

  const signSOAP = useSignSOAP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    try {
      const result = await signSOAP.mutateAsync({
        document: selectedFile,
        soap1Dot2: soap12,
      });
      
      // Auto-download signed SOAP
      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Success toast
      toast.success('SOAP İmzalama Başarılı!', {
        description: `${selectedFile.name} başarıyla imzalandı ve indiriliyor.`,
      });
    } catch (error) {
      // Error toast
      toast.error('SOAP İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'SOAP imzalama sırasında bir hata oluştu.',
      });
      console.error('Sign error:', error);
    }
  };

  // Auto-clear previous state on unmount
  useEffect(() => {
    return () => {
      signSOAP.reset();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const loadExample = () => {
    const example = soap12 ? EXAMPLE_SOAP_12 : EXAMPLE_SOAP_11;
    const blob = new Blob([example], { type: 'application/xml' });
    const file = new File([blob], `example-soap${soap12 ? '12' : '11'}.xml`, { type: 'application/xml' });
    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SOAP İmzalama (WS-Security)</h1>
        <p className="mt-2 text-muted-foreground">
          SOAP mesajlarınızı WS-Security ile dijital olarak imzalayın
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              SOAP Mesajı
            </CardTitle>
            <CardDescription>
              İmzalanacak SOAP mesajını yükleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SOAP Version */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="soap12"
                  checked={soap12}
                  onCheckedChange={setSoap12}
                />
                <Label htmlFor="soap12" className="cursor-pointer text-sm font-normal">
                  SOAP 1.2 (varsayılan: SOAP 1.1)
                </Label>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="soap-file">SOAP XML Dosyası</Label>
                <div className="flex gap-2">
                  <Input
                    id="soap-file"
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
                  <p className="text-xs text-muted-foreground">
                    Seçilen: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={signSOAP.isPending || !selectedFile}
              >
                {signSOAP.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    İmzalanıyor...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    SOAP İmzala
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>WS-Security Hakkında</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium">WS-Security Özellikleri:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>SOAP 1.1 ve 1.2 desteği</li>
                  <li>XML Signature standardı</li>
                  <li>Security header kullanımı</li>
                  <li>Web servisleri güvenliği</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Kullanım Alanları:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>Web servisleri güvenliği</li>
                  <li>B2B entegrasyonlar</li>
                  <li>SOAP tabanlı API'ler</li>
                  <li>Güvenli mesajlaşma</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
