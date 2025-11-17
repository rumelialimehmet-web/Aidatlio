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

#### 2.1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun
2. Proje adı: `aidatlio` (veya istediğiniz isim)
3. Google Analytics'i devre dışı bırakın

#### 2.2. Web Uygulaması Ekleyin

1. Firebase Console'da proje açıkken `</>` (web) ikonuna tıklayın
2. App nickname: `Aidatlio Web`
3. Firebase Hosting'i işaretlemeyin
4. `firebaseConfig` değerlerini kopyalayın

#### 2.3. Authentication Ayarları

1. **Build** → **Authentication** → **Get started**
2. **Email/Password** provider'ı aktifleştirin
3. **Google** provider'ı aktifleştirin ve support email seçin

#### 2.4. Firestore Database

1. **Build** → **Firestore Database** → **Create database**
2. Location: `europe-west` (Türkiye'ye yakın)
3. **Start in production mode** seçin
4. **Rules** sekmesinde `firestore.rules` dosyasındaki kuralları yapıştırın
5. **Publish** tıklayın

#### 2.5. Storage

1. **Build** → **Storage** → **Get started**
2. **Start in production mode** seçin
3. Location: `europe-west`
4. **Rules** sekmesinde `storage.rules` dosyasındaki kuralları yapıştırın
5. **Publish** tıklayın

#### 2.6. Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

Ardından Firebase Console'dan aldığınız değerleri `.env` dosyasına yapıştırın:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=aidatlio-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aidatlio-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=aidatlio-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama http://localhost:5173 adresinde çalışacaktır.

### 4. Production Build

```bash
npm run build
```

## Deployment (Vercel)

### Adım 1: GitHub Repository'yi Hazırlayın

```bash
# Değişiklikleri commit edin
git add .
git commit -m "Ready for deployment"
git push
```

### Adım 2: Vercel'e Deploy Edin

1. [Vercel](https://vercel.com) hesabınızla giriş yapın (GitHub ile)
2. **Add New...** → **Project** tıklayın
3. GitHub repository'nizi seçin (Aidatlio)
4. **Import** tıklayın

### Adım 3: Environment Variables Ekleyin

**Environment Variables** bölümünde şu değişkenleri **TEK TEK** ekleyin:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Firebase Console'dan aldığınız API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `projeniz.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `projeniz.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

**Environment:** All (Production, Preview, Development) seçin

### Adım 4: Deploy

1. **Deploy** butonuna tıklayın
2. Build tamamlanınca (2-3 dakika) siteniz hazır!
3. Vercel size bir URL verecek: `https://aidatlio.vercel.app`

### Adım 5: Firebase Domain Ayarları (Opsiyonel)

Firebase Console'da **Authentication** → **Settings** → **Authorized domains**:
- Vercel URL'inizi ekleyin: `aidatlio.vercel.app`

### Sorun Giderme

**Beyaz ekran görüyorsanız:**
1. Vercel Dashboard → Deployments → Son deployment → **View Function Logs**
2. Environment variables'ları kontrol edin
3. **Redeploy** yapın

**Firebase hatası alıyorsanız:**
1. Firebase Console → Firestore/Storage → Rules
2. `firestore.rules` ve `storage.rules` dosyalarındaki kuralları yapıştırın
3. **Publish** tıklayın

## Lisans

MIT

## Destek

Sorularınız için issue açabilirsiniz.
