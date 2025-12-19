import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useSignCAdES, useSignHash } from '@/hooks/use-sign';
import type { TimestampType } from '@/api/generated';
import { Loader2, FileSignature, Hash, CheckCircle2, Info, Copy } from 'lucide-react';
import { toast } from 'sonner';

const EXAMPLE_JSON_CONTENT = `{"id":"EAA2025000000014","cid":"23a1636a-9ae0-4c30-b3f7-2b9dd622af75","type":"EArchiveSent","account":5278,"timestamp":"2025-12-18T15:05:26.266Z"}`;

const TIMESTAMP_OPTIONS: { value: TimestampType; label: string; description: string }[] = [
  { value: 'none', label: 'Yok (CAdES-B)', description: 'Zaman damgası yok' },
  { value: 'signature', label: 'İmza ZD (CAdES-T)', description: 'İmza zaman damgası' },
  { value: 'archive', label: 'Arşiv ZD (CAdES-A)', description: 'Arşiv zaman damgası (LTA)' },
  { value: 'all', label: 'Tümü', description: 'İmza + Arşiv zaman damgası' },
];

export function CadesPage() {
  // CAdES state
  const [content, setContent] = useState('');
  const [timestampType, setTimestampType] = useState<TimestampType>('signature');

  // Hash Sign state
  const [hashValue, setHashValue] = useState('');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-256');
  const [signatureResult, setSignatureResult] = useState<{
    signatureValue: string;
    certificate: string;
    certificateChain: string;
    signatureAlgorithm: string;
  } | null>(null);

  const signCAdES = useSignCAdES();
  const signHash = useSignHash();

  // CAdES Sign Handler
  const handleCAdESSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('İçerik boş olamaz');
      return;
    }

    try {
      const result = await signCAdES.mutateAsync({
        content,
        timestampType,
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
        description: `İçerik başarıyla imzalandı. Zaman damgası: ${timestampType}`,
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı`);
  };

  const loadExample = () => {
    setContent(EXAMPLE_JSON_CONTENT);
    toast.info('Örnek içerik yüklendi');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CAdES & Hash İmzalama</h1>
        <p className="text-muted-foreground mt-2">
          Metin içeriği veya hash değeri imzalama işlemleri
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Bilgi</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>CAdES İmzalama:</strong> Metin içeriğini PKCS#7/CMS formatında imzalar (.p7s)</li>
            <li>• <strong>Hash İmzalama:</strong> Client tarafında hazırlanan hash'i imzalar (XAdES remote signing için)</li>
            <li>• <strong>Zaman Damgası Türleri:</strong> none (CAdES-B), signature (CAdES-T), archive (CAdES-A/LTA)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="cades" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="cades" className="flex items-center gap-2">
            <FileSignature className="h-4 w-4" />
            CAdES İmzalama
          </TabsTrigger>
          <TabsTrigger value="hash" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Hash İmzalama
          </TabsTrigger>
        </TabsList>

        {/* CAdES Tab */}
        <TabsContent value="cades">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                CAdES İmzalama
              </CardTitle>
              <CardDescription>
                Metin içeriğini CAdES formatında imzalayın. Çıktı PKCS#7/CMS formatındadır (.p7s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCAdESSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">İçerik</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={loadExample}>
                      Örnek Yükle
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="İmzalanacak metin içeriğini buraya yapıştırın..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Zaman Damgası Türü</Label>
                  <Select value={timestampType} onValueChange={(v) => setTimestampType(v as TimestampType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMESTAMP_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.label}</span>
                            <span className="text-xs text-muted-foreground">- {option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={signCAdES.isPending || !content.trim()}
                  className="w-full"
                >
                  {signCAdES.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İmzalanıyor...
                    </>
                  ) : (
                    <>
                      <FileSignature className="mr-2 h-4 w-4" />
                      CAdES İmzala
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hash Sign Tab */}
        <TabsContent value="hash">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Hash İmzalama
                </CardTitle>
                <CardDescription>
                  Client tarafında hesaplanan hash değerini imzalayın. XAdES remote signing için idealdir.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHashSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hash">Hash Değeri (Base64)</Label>
                    <Textarea
                      id="hash"
                      placeholder="Base64 encoded hash değerini buraya yapıştırın..."
                      value={hashValue}
                      onChange={(e) => setHashValue(e.target.value)}
                      className="min-h-[100px] font-mono text-sm"
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
                        <SelectItem value="SHA-1">SHA-1 (Önerilmez)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={signHash.isPending || !hashValue.trim()}
                    className="w-full"
                  >
                    {signHash.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        İmzalanıyor...
                      </>
                    ) : (
                      <>
                        <Hash className="mr-2 h-4 w-4" />
                        Hash İmzala
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  İmza Sonucu
                </CardTitle>
                <CardDescription>
                  İmzalama sonucunda dönen değerler
                </CardDescription>
              </CardHeader>
              <CardContent>
                {signatureResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Başarılı</Badge>
                      <span className="text-sm text-muted-foreground">
                        Algoritma: {signatureResult.signatureAlgorithm}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>İmza Değeri (Base64)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(signatureResult.signatureValue, 'İmza değeri')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={signatureResult.signatureValue}
                        readOnly
                        className="min-h-[80px] font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Sertifika (Base64 DER)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(signatureResult.certificate, 'Sertifika')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={signatureResult.certificate}
                        readOnly
                        className="min-h-[80px] font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Sertifika Zinciri (PEM)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(signatureResult.certificateChain, 'Sertifika zinciri')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={signatureResult.certificateChain}
                        readOnly
                        className="min-h-[120px] font-mono text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Hash className="h-12 w-12 mb-4 opacity-50" />
                    <p>Hash imzalandığında sonuçlar burada görünecek</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
