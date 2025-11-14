# Aidatlio - Apartman Aidat Takip Sistemi

Apartman ve site yöneticileri için ücretsiz aidat ve ortak gider takip uygulaması.

## Özellikler

- ✅ Apartman ve daire yönetimi
- ✅ Aidat ve ortak gider takibi
- ✅ Daire sahipleri için özel erişim linkleri
- ✅ Ödeme dekontu yükleme
- ✅ Mobil uyumlu tasarım
- ✅ Tamamen ücretsiz

## Teknoloji Stack

- **Frontend**: React 18 + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Vercel

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Firebase Yapılandırması

1. [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun
2. Authentication bölümünden Email/Password ve Google girişini aktifleştirin
3. Firestore Database oluşturun (test mode ile başlayın)
4. Storage'ı aktifleştirin
5. Proje ayarlarından Firebase config bilgilerini alın
6. `.env.example` dosyasını `.env` olarak kopyalayın ve bilgilerinizi girin

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama http://localhost:5173 adresinde çalışacaktır.

### 4. Production Build

```bash
npm run build
```

## Deployment

Vercel üzerinde deploy etmek için:

1. GitHub'a push yapın
2. [Vercel](https://vercel.com) üzerinden projeyi import edin
3. Environment variables ekleyin (.env dosyasındaki değerleri)
4. Deploy edin

## Lisans

MIT

## Destek

Sorularınız için issue açabilirsiniz.
