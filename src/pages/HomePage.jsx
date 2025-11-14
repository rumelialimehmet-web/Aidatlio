import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useAuthStore } from '@/store/authStore';
import { Building2, LogOut, Plus } from 'lucide-react';

export function HomePage() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, loading, signOut: logout, initAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

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

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Aidatlio
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Apartman aidatlarınızı ve ortak giderlerinizi kolayca takip edin.
              Kiracılarınızla paylaşılabilir linkler oluşturun. Tamamen ücretsiz başlayın.
            </p>
            <Button
              size="lg"
              onClick={() => setShowAuthDialog(true)}
              className="text-lg px-8 py-6"
            >
              Giriş Yap / Kayıt Ol
            </Button>
          </div>

          {/* Özellikler */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  Kolay Yönetim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Apartmanınızı ve dairelerinizi kolayca yönetin. Borç ve ödemeleri tek yerden takip edin.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-primary" />
                  Gider Takibi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ortak giderleri ekleyin, otomatik olarak dairelere paylaştırın. Her şey şeffaf.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  Paylaşılabilir Linkler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Her daire için özel link oluşturun. Kiracılar borçlarını görebilir, dekont yükleyebilir.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
    );
  }

  // Kullanıcı giriş yaptıysa
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Aidatlio</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Apartmanlarım</h2>
            <Button onClick={() => navigate('/apartman-olustur')}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Apartman Oluştur
            </Button>
          </div>

          {/* Apartman listesi - şimdilik boş */}
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Henüz apartman oluşturmadınız</p>
                <p className="text-sm mb-4">
                  İlk apartmanınızı oluşturarak başlayın
                </p>
                <Button onClick={() => navigate('/apartman-olustur')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Apartman Oluştur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
