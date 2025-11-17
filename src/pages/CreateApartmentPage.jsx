import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { createApartman, createDaire } from '@/lib/firestore';
import { Building2, Home, ArrowLeft, Plus, Trash2 } from 'lucide-react';

export function CreateApartmentPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Apartman bilgileri, 2: Daire bilgileri

  // Apartman bilgileri
  const [apartmanAdi, setApartmanAdi] = useState('');
  const [daireSayisi, setDaireSayisi] = useState(8);
  const [varsayilanAidat, setVarsayilanAidat] = useState(500);

  // Daire listesi
  const [daireler, setDaireler] = useState([]);

  // Adım 1'den Adım 2'ye geç
  const handleNextStep = (e) => {
    e.preventDefault();

    if (!apartmanAdi.trim()) {
      alert('Apartman adı giriniz');
      return;
    }

    if (daireSayisi < 1 || daireSayisi > 100) {
      alert('Daire sayısı 1-100 arasında olmalıdır');
      return;
    }

    // Otomatik daire listesi oluştur
    const otomatikDaireler = [];
    for (let i = 1; i <= daireSayisi; i++) {
      // Daire numarası: 101, 102, 103... (1. kat) veya 201, 202... (2. kat)
      const kat = Math.floor((i - 1) / 4) + 1; // Her 4 daire 1 kat
      const daireNo = kat * 100 + ((i - 1) % 4) + 1;

      otomatikDaireler.push({
        daireNo: daireNo.toString(),
        sahibiAdi: '',
        telefon: '',
        email: '',
      });
    }

    setDaireler(otomatikDaireler);
    setStep(2);
  };

  // Daire bilgisi güncelle
  const updateDaire = (index, field, value) => {
    const yeniDaireler = [...daireler];
    yeniDaireler[index][field] = value;
    setDaireler(yeniDaireler);
  };

  // Daire ekle
  const addDaire = () => {
    setDaireler([
      ...daireler,
      {
        daireNo: '',
        sahibiAdi: '',
        telefon: '',
        email: '',
      },
    ]);
  };

  // Daire sil
  const removeDaire = (index) => {
    setDaireler(daireler.filter((_, i) => i !== index));
  };

  // Apartman ve daireleri kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Giriş yapmalısınız');
      return;
    }

    // En az 1 daire olmalı
    if (daireler.length === 0) {
      alert('En az 1 daire eklemelisiniz');
      return;
    }

    // Tüm daire numaraları dolu mu kontrol et
    const boslukVar = daireler.some(d => !d.daireNo.trim());
    if (boslukVar) {
      alert('Tüm daire numaralarını doldurunuz');
      return;
    }

    setLoading(true);

    try {
      // Apartmanı oluştur
      const apartmanData = {
        ad: apartmanAdi.trim(),
        daireSayisi: daireler.length,
        varsayilanAidat: Number(varsayilanAidat) || 0,
      };

      const apartmanId = await createApartman(user.uid, apartmanData);

      // Daireleri oluştur
      const dairePromises = daireler.map(daire =>
        createDaire(apartmanId, {
          daireNo: daire.daireNo.trim(),
          sahibiAdi: daire.sahibiAdi.trim() || 'Belirtilmemiş',
          telefon: daire.telefon.trim() || '',
          email: daire.email.trim() || '',
        })
      );

      await Promise.all(dairePromises);

      // Başarılı, apartman detay sayfasına yönlendir
      navigate(`/apartman/${apartmanId}`);
    } catch (error) {
      console.error('Hata:', error);
      alert('Apartman oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => step === 1 ? navigate('/') : setStep(1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-gray-900">Yeni Apartman Oluştur</h1>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Adım {step} / 2
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {step === 1 ? (
            // ADIM 1: Apartman Bilgileri
            <Card>
              <CardHeader>
                <CardTitle>Apartman Bilgileri</CardTitle>
                <CardDescription>
                  Apartmanınızın genel bilgilerini girin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="apartmanAdi">
                      Apartman Adı <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apartmanAdi"
                      placeholder="Örn: Çiçek Apartmanı, Site A Blok"
                      value={apartmanAdi}
                      onChange={(e) => setApartmanAdi(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daireSayisi">
                      Daire Sayısı <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="daireSayisi"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="8"
                      value={daireSayisi}
                      onChange={(e) => setDaireSayisi(Number(e.target.value))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Bir sonraki adımda daire numaralarını düzenleyebilirsiniz
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="varsayilanAidat">
                      Varsayılan Aylık Aidat (₺) (Opsiyonel)
                    </Label>
                    <Input
                      id="varsayilanAidat"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="500"
                      value={varsayilanAidat}
                      onChange={(e) => setVarsayilanAidat(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Her daire için varsayılan aidat tutarı (sonra değiştirebilirsiniz)
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    İleri: Daire Bilgileri
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            // ADIM 2: Daire Bilgileri
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Daire Bilgileri</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDaire}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Daire Ekle
                  </Button>
                </CardTitle>
                <CardDescription>
                  Daire numaralarını ve sahip bilgilerini girin (sahip bilgileri opsiyonel)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {daireler.map((daire, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-sm font-medium">
                            <Home className="h-4 w-4 mr-2 text-primary" />
                            Daire {index + 1}
                          </div>
                          {daireler.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDaire(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`daireNo-${index}`} className="text-xs">
                              Daire No <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`daireNo-${index}`}
                              placeholder="101"
                              value={daire.daireNo}
                              onChange={(e) => updateDaire(index, 'daireNo', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor={`sahibi-${index}`} className="text-xs">
                              Sahip/Kiracı Adı
                            </Label>
                            <Input
                              id={`sahibi-${index}`}
                              placeholder="Ahmet Yılmaz"
                              value={daire.sahibiAdi}
                              onChange={(e) => updateDaire(index, 'sahibiAdi', e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor={`telefon-${index}`} className="text-xs">
                              Telefon
                            </Label>
                            <Input
                              id={`telefon-${index}`}
                              placeholder="0555 123 45 67"
                              value={daire.telefon}
                              onChange={(e) => updateDaire(index, 'telefon', e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor={`email-${index}`} className="text-xs">
                              Email
                            </Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              placeholder="ornek@email.com"
                              value={daire.email}
                              onChange={(e) => updateDaire(index, 'email', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full"
                    >
                      Geri
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Oluşturuluyor...' : 'Apartmanı Oluştur'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
