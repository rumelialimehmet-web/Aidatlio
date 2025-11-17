import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getApartman,
  getDaire,
  getApartmanGiderler,
  getDaireOdemeDekontlari,
  createOdemeDekontu,
} from '@/lib/firestore';
import { uploadOdemeDekont, validateFileSize, validateFileType } from '@/lib/storage';
import {
  Building2,
  Home,
  Upload,
  FileCheck,
  AlertCircle,
  DollarSign,
  Clock,
} from 'lucide-react';

export function UnitViewPage() {
  const { apartmanId, daireId } = useParams();

  const [loading, setLoading] = useState(true);
  const [apartman, setApartman] = useState(null);
  const [daire, setDaire] = useState(null);
  const [giderler, setGiderler] = useState([]);
  const [dekontlar, setDekontlar] = useState([]);

  // Dekont yükleme
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [apartmanId, daireId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apartmanData, daireData, giderlerData, dekontlarData] = await Promise.all([
        getApartman(apartmanId),
        getDaire(daireId),
        getApartmanGiderler(apartmanId),
        getDaireOdemeDekontlari(daireId),
      ]);

      setApartman(apartmanData);
      setDaire(daireData);
      setGiderler(giderlerData);
      setDekontlar(dekontlarData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü
    if (!validateFileSize(file)) {
      alert('Dosya boyutu en fazla 5MB olmalıdır');
      return;
    }

    // Dosya tipi kontrolü
    if (!validateFileType(file)) {
      alert('Sadece resim (JPG, PNG) veya PDF dosyası yükleyebilirsiniz');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Lütfen bir dosya seçin');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      // Dosyayı Storage'a yükle
      const downloadURL = await uploadOdemeDekont(selectedFile, apartmanId, daireId);

      // Dekont kaydını Firestore'a ekle
      await createOdemeDekontu({
        apartmanId,
        daireId,
        dosyaURL: downloadURL,
        dosyaAdi: selectedFile.name,
        dosyaBoyutu: selectedFile.size,
      });

      // Başarılı
      setUploadSuccess(true);
      setSelectedFile(null);

      // Dekontları yenile
      const yeniDekontlar = await getDaireOdemeDekontlari(daireId);
      setDekontlar(yeniDekontlar);

      // Input'u temizle
      document.getElementById('file-upload').value = '';

      alert('Ödeme dekontunuz başarıyla yüklendi! Yöneticiniz en kısa sürede inceleyecektir.');
    } catch (error) {
      console.error('Dekont yükleme hatası:', error);
      alert('Dekont yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  // Daire başı gider hesapla
  const daireBorcu = daire?.toplamBorc || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!apartman || !daire) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Daire bulunamadı</p>
              <p className="text-sm text-gray-600">
                Bu link geçersiz olabilir. Lütfen yöneticinizle iletişime geçin.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartman.ad}</h1>
          <div className="flex items-center justify-center space-x-2">
            <Home className="h-5 w-5 text-gray-600" />
            <p className="text-xl text-gray-600">Daire {daire.daireNo}</p>
          </div>
          {daire.sahibiAdi && daire.sahibiAdi !== 'Belirtilmemiş' && (
            <p className="text-sm text-gray-500 mt-1">{daire.sahibiAdi}</p>
          )}
        </div>

        {/* Borç Durumu */}
        <Card className="mb-6">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Borç Durumunuz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">
                {daireBorcu === 0 ? (
                  <span className="text-green-600">₺0.00</span>
                ) : (
                  <span className="text-red-600">₺{daireBorcu.toFixed(2)}</span>
                )}
              </p>
              {daireBorcu === 0 ? (
                <Badge variant="success" className="text-sm">
                  Borcunuz Bulunmamaktadır
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-sm">
                  Ödenmesi Gereken Tutar
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ödeme Dekontu Yükleme */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Ödeme Dekontu Yükle
            </CardTitle>
            <CardDescription>
              Ödeme yaptıysanız, dekontunuzu buradan yükleyerek yöneticinize bildirebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Dekont Dosyası (Resim veya PDF, max 5MB)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Seçili dosya: {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Dekontu Yükle
                  </>
                )}
              </Button>

              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
                  <FileCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">
                    Dekontunuz başarıyla yüklendi! Yöneticiniz en kısa sürede inceleyecektir.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Yüklenen Dekontlar */}
        {dekontlar.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                Yüklediğiniz Dekontlar ({dekontlar.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dekontlar.map((dekont) => (
                  <div
                    key={dekont.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileCheck className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{dekont.dosyaAdi}</p>
                        <p className="text-xs text-gray-600">
                          {dekont.olusturmaTarihi?.toDate
                            ? new Date(dekont.olusturmaTarihi.toDate()).toLocaleDateString(
                                'tr-TR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )
                            : 'Tarih bilinmiyor'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          dekont.durum === 'onaylandi'
                            ? 'success'
                            : dekont.durum === 'reddedildi'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {dekont.durum === 'beklemede' && (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            İnceleniyor
                          </>
                        )}
                        {dekont.durum === 'onaylandi' && 'Onaylandı'}
                        {dekont.durum === 'reddedildi' && 'Reddedildi'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(dekont.dosyaURL, '_blank')}
                      >
                        Görüntüle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gider Geçmişi */}
        {giderler.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Gider Geçmişi
              </CardTitle>
              <CardDescription>
                Apartmanınızın ortak gider detayları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {giderler.map((gider) => (
                  <div
                    key={gider.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{gider.ad}</p>
                        <p className="text-sm text-gray-600">
                          {gider.tarih?.toDate
                            ? new Date(gider.tarih.toDate()).toLocaleDateString('tr-TR')
                            : new Date(gider.tarih).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₺{gider.daireBasi.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">
                        Toplam: ₺{gider.tutar.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Bu sayfa size özeldir. Başkalarıyla paylaşmayınız.</p>
          <p className="mt-1">
            Sorularınız için lütfen apartman yöneticinizle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
