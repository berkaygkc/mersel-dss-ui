import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignPDF } from '@/hooks/use-sign';
import { Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function PDFSignPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [appendMode, setAppendMode] = useState(false);

  const signPDF = useSignPDF();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    try {
      const result = await signPDF.mutateAsync({
        document: selectedFile,
        appendMode,
      });
      
      // Auto-download signed PDF
      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Success toast
      toast.success('PDF İmzalama Başarılı!', {
        description: `${selectedFile.name} başarıyla imzalandı ve indiriliyor.`,
      });
    } catch (error) {
      // Error toast
      toast.error('PDF İmzalama Hatası!', {
        description: (error as any)?.body?.message || (error as any)?.message || 'PDF imzalama sırasında bir hata oluştu.',
      });
      console.error('Sign error:', error);
    }
  };

  // Auto-clear previous state on unmount
  useEffect(() => {
    return () => {
      signPDF.reset();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PDF İmzalama (PAdES)</h1>
        <p className="mt-2 text-muted-foreground">
          PDF belgelerinizi dijital olarak imzalayın
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Belgesi Yükle
            </CardTitle>
            <CardDescription>
              İmzalanacak PDF dosyasını seçin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="pdf-file">PDF Dosyası</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Seçilen: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Append Mode */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="append-mode"
                  checked={appendMode}
                  onCheckedChange={setAppendMode}
                />
                <Label htmlFor="append-mode" className="cursor-pointer text-sm font-normal">
                  Append Mode (Mevcut imzaların üzerine ekle)
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={signPDF.isPending || !selectedFile}
              >
                {signPDF.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    İmzalanıyor...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF İmzala
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
              <CardTitle>PAdES Hakkında</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>PAdES (PDF Advanced Electronic Signatures)</strong>
              </p>
              <p>
                PDF belgelerine ETSI standardına uygun dijital imza ekler.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>CAdES tabanlı gömülü imza</li>
                <li>PDF görsel bütünlüğü korunur</li>
                <li>Çoklu imza desteği (Append Mode)</li>
                <li>Adobe Reader uyumlu</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
