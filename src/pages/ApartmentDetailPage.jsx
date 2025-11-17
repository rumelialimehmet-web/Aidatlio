import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/store/authStore';
import {
  getApartman,
  getApartmanDaireler,
  getApartmanGiderler,
  createGider,
  updateDaire,
} from '@/lib/firestore';
import {
  Building2,
  ArrowLeft,
  Plus,
  Copy,
  Check,
  Link as LinkIcon,
  DollarSign,
} from 'lucide-react';

export function ApartmentDetailPage() {
  const { apartmanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [apartman, setApartman] = useState(null);
  const [daireler, setDaireler] = useState([]);
  const [giderler, setGiderler] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gider ekleme modal
  const [showGiderModal, setShowGiderModal] = useState(false);
  const [giderAdi, setGiderAdi] = useState('');
  const [giderTutari, setGiderTutari] = useState('');
  const [giderTarihi, setGiderTarihi] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [savingGider, setSavingGider] = useState(false);

  // Link kopyalama
  const [copiedDaireId, setCopiedDaireId] = useState(null);

  useEffect(() => {
    loadData();
  }, [apartmanId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apartmanData, dairelerData, giderlerData] = await Promise.all([
        getApartman(apartmanId),
        getApartmanDaireler(apartmanId),
        getApartmanGiderler(apartmanId),
      ]);

      setApartman(apartmanData);
      setDaireler(dairelerData);
      setGiderler(giderlerData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      alert('Apartman bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Gider ekle
  const handleAddGider = async (e) => {
    e.preventDefault();

    if (!giderAdi.trim() || !giderTutari) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setSavingGider(true);

    try {
      const tutar = parseFloat(giderTutari);
      const daireBasi = tutar / daireler.length;

      // Gideri kaydet
      await createGider({
        apartmanId,
        ad: giderAdi.trim(),
        tutar,
        tarih: new Date(giderTarihi),
        bolmeYontemi: 'esit',
        daireBasi,
      });

      // Her daireye borç ekle
      const updatePromises = daireler.map((daire) =>
        updateDaire(daire.id, {
          toplamBorc: (daire.toplamBorc || 0) + daireBasi,
        })
      );

      await Promise.all(updatePromises);

      // Veriyi yenile
      await loadData();

      // Modal'ı kapat ve formu temizle
      setShowGiderModal(false);
      setGiderAdi('');
      setGiderTutari('');
      setGiderTarihi(new Date().toISOString().split('T')[0]);

      alert('Gider başarıyla eklendi ve dairelere paylaştırıldı!');
    } catch (error) {
      console.error('Gider ekleme hatası:', error);
      alert('Gider eklenirken bir hata oluştu');
    } finally {
      setSavingGider(false);
    }
  };

  // Ödendi olarak işaretle
  const handleMarkAsPaid = async (daire) => {
    if (!confirm(`${daire.daireNo} numaralı dairenin borcunu sıfırlamak istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await updateDaire(daire.id, {
        toplamBorc: 0,
      });

      // Veriyi yenile
      await loadData();

      alert('Borç sıfırlandı!');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('Borç güncellenirken bir hata oluştu');
    }
  };

  // Link kopyala
  const copyDaireLink = (daireId) => {
    const url = `${window.location.origin}/apartman/${apartmanId}/daire/${daireId}`;
    navigator.clipboard.writeText(url);
    setCopiedDaireId(daireId);
    setTimeout(() => setCopiedDaireId(null), 2000);
  };

  // Toplam borç hesapla
  const toplamBorc = daireler.reduce((sum, d) => sum + (d.toplamBorc || 0), 0);
  const toplamOdenen = giderler.reduce((sum, g) => sum + g.tutar, 0) - toplamBorc;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!apartman) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Apartman bulunamadı</p>
          <Button onClick={() => navigate('/')}>Ana Sayfaya Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-gray-900">{apartman.ad}</h1>
              </div>
            </div>
            <Button onClick={() => setShowGiderModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Gider Ekle
            </Button>
          </div>

          {/* Özet kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Toplam Gider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{toplamOdenen.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Toplam Borç
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  ₺{toplamBorc.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Toplanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ₺{toplamOdenen.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Daire listesi */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Daireler ({daireler.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Daire No</TableHead>
                    <TableHead>Sahip/Kiracı</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead className="text-right">Toplam Borç</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daireler.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        Henüz daire bulunmuyor
                      </TableCell>
                    </TableRow>
                  ) : (
                    daireler.map((daire) => (
                      <TableRow key={daire.id}>
                        <TableCell className="font-medium">{daire.daireNo}</TableCell>
                        <TableCell>{daire.sahibiAdi}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {daire.telefon || '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₺{(daire.toplamBorc || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(daire.toplamBorc || 0) === 0 ? (
                            <Badge variant="success">Borcu Yok</Badge>
                          ) : (
                            <Badge variant="destructive">Borçlu</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {(daire.toplamBorc || 0) > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsPaid(daire)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Ödendi
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyDaireLink(daire.id)}
                            >
                              {copiedDaireId === daire.id ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Gider geçmişi */}
        {giderler.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Gider Geçmişi</CardTitle>
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
                      <p className="font-bold">₺{gider.tutar.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        Daire başı: ₺{gider.daireBasi.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gider Ekleme Modal */}
      <Dialog open={showGiderModal} onOpenChange={setShowGiderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Gider Ekle</DialogTitle>
            <DialogDescription>
              Gider otomatik olarak tüm dairelere eşit şekilde paylaştırılacaktır
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddGider}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="giderAdi">
                  Gider Adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="giderAdi"
                  placeholder="Örn: Asansör bakımı, Temizlik"
                  value={giderAdi}
                  onChange={(e) => setGiderAdi(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="giderTutari">
                  Toplam Tutar (₺) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="giderTutari"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1000"
                  value={giderTutari}
                  onChange={(e) => setGiderTutari(e.target.value)}
                  required
                />
                {giderTutari && daireler.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Daire başı: ₺{(parseFloat(giderTutari) / daireler.length).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="giderTarihi">Tarih</Label>
                <Input
                  id="giderTarihi"
                  type="date"
                  value={giderTarihi}
                  onChange={(e) => setGiderTarihi(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGiderModal(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={savingGider}>
                {savingGider ? 'Ekleniyor...' : 'Gider Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
