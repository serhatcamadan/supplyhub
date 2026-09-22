# SupplyHub

![Unit Tests](https://github.com/serhatcamadan/supplyhub/actions/workflows/test.yml/badge.svg?branch=main)

**B2B toptan tedarik platformu** — Satıcılar (tedarikçiler) ile alıcıları (perakendeciler, restoranlar, üreticiler) buluşturan full-stack portföy projesi.

Kademeli fiyatlandırma, teklif pazarlığı (RFQ), kurumsal onay akışı ve canlı (WebSocket) açık artırma ihaleleri gibi gerçek B2B karmaşıklıklarını modellemek amacıyla geliştirildi.

**Canlı site:** https://supplyhub-ashen.vercel.app

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript (strict) |
| Stil | Tailwind CSS v4 + shadcn/ui |
| Backend API | NestJS 12 (Railway, Docker — uzun ömürlü process) — [`supplyhub-api`](https://github.com/serhatcamadan/supplyhub-api) |
| Veritabanı | Supabase (PostgreSQL) + Prisma ORM (backend üzerinden) |
| Auth | NestJS JWT (access + refresh cookie) + OTP e-posta doğrulama |
| Canlı ihale | Socket.IO client (`socket.io-client`) + Zustand (`lib/stores/`) — backend'deki gömülü WebSocket Gateway'e bağlanır |
| Form & Validasyon | react-hook-form + Zod v4 |
| Grafikler | Recharts |
| i18n | next-intl (TR / EN) |
| Test | Vitest (unit) + Playwright (E2E) |
| CI/CD | GitHub Actions |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Özellikler

### Satıcı Portalı (`/seller`)

- **Dashboard** — Gelir grafiği (Recharts), KPI kartları, aktivite akışı, en çok satan ürünler
- **Ürün Yönetimi** — Ürün listesi (filtre/grid/toplu işlem), yeni ürün formu, kademeli fiyatlandırma (price tiers), çoklu görsel yükleme
- **Teklif Talepleri (RFQ)** — Alıcıdan gelen teklifleri yanıtlama, canlı toplam hesaplama, taslak kaydetme
- **Sipariş Yönetimi** — Sipariş durumu takibi (Bekliyor → Onaylandı → Kargoda → Teslim Edildi), sipariş detay sayfası
- **Canlı İhale** — Mevcut bir ürünü açık artırmaya çıkarma, gerçek zamanlı teklif izleme, iptal etme
- **Alıcı Detayı** — Bir alıcı şirketle geçmiş sipariş/gelir özeti

### Alıcı Portalı (`/buyer`)

- **Ürün Keşfi** — Kategori/fiyat filtreleme, ürün detay sayfası, görsel galeri, gerçek fiyat trend grafiği, satıcı bilgisi + gerçek teslimat oranı
- **Sipariş Paneli** — Adet seçici (stok + min. sipariş korumalı), tier fiyatı otomatik hesaplama, Sepete Ekle
- **Sepet** — Tier ilerleme çubuğu, promosyon nudge banner, satıcıya özel kargo eşiği, KDV hesaplama, sepet şablonları
- **Teklif Talebi (RFQ)** — Hedef fiyat, teslimat tarihi, dosya eki, tedarikçi bilgisi
- **Canlı İhale** — Aktif ihalelere göz atma, gerçek zamanlı teklif verme (WebSocket), teklif geçmişi
- **Sipariş Geçmişi** — Teslim edilen, kargodaki, onaylanan siparişler, ürün değerlendirme
- **Onay Yönetimi** — Staff'in bütçe limitini aşan siparişleri admin onayına sunar

### Kimlik Doğrulama & Kayıt

- 4 adımlı signup: Hesap Bilgileri → Rol Seçimi → Şirket Bilgileri → E-posta OTP Doğrulama
- NestJS JWT (access token 15dk + refresh token 7gün, refresh httpOnly cookie)
- RBAC: `seller`, `buyer/admin`, `buyer/staff` rolleri (backend `RolesGuard` ile uygulanır)
- Route koruması (`proxy.ts`) — yetkisiz erişimi otomatik yönlendirir; şifre alanlarında göz ikonuyla göster/gizle
- Tüm hata mesajları HTTP durum koduna göre seçilir ve seçili dile göre lokalize edilir — backend'in ham/İngilizce metni asla doğrudan gösterilmez

---

## Kurulum

### Gereksinimler

- Node.js 22+
- npm 10+
- Supabase hesabı
- NestJS backend (`supplyhub-api`) çalışıyor olmalı

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/serhatcamadan/supplyhub.git
cd supplyhub

# 2. Bağımlılıkları kur
npm install

# 3. Ortam değişkenlerini tanımla
cp .env.example .env.local
# .env.local dosyasını düzenle (aşağıya bakın)

# 4. Backend'i başlat (ayrı terminalda)
# supplyhub-api reposunu kur ve çalıştır
# Bkz: https://github.com/serhatcamadan/supplyhub-api

# 5. Veritabanını hazırla
curl -X POST http://localhost:3000/api/seed

# 6. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

### Ortam Değişkenleri (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NestJS Backend — hem REST hem WebSocket (Socket.IO) bu adresten okunur
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT (backend ile aynı secret olmalı)
JWT_ACCESS_SECRET=
```

> `SUPABASE_SERVICE_ROLE_KEY` yalnızca üç server-only route'ta kullanılır (`app/api/products/upload-image`, `app/api/quotes/upload-attachment`, `app/api/test-reset`) — sayfa/veri sorgularının hiçbiri artık Supabase'e doğrudan gitmiyor, tamamı NestJS backend'i üzerinden.

---

## Demo Hesapları

Seed API çalıştırıldıktan sonra aşağıdaki hesaplarla giriş yapılabilir (şifre: `Demo1234!`):

| E-posta | Portal | Rol |
|---|---|---|
| `ali@freshfarm.com` | Satıcı | Admin |
| `ayse@gunespazar.com` | Alıcı | Admin |
| `fatma@gunespazar.com` | Alıcı | Staff |
| `kemal@lezzet.com` | Alıcı | Admin |

> Yeni hesap oluşturmak için signup akışını kullanın. OTP doğrulama e-postası Resend üzerinden gönderilir.

---

## Güvenlik

Proje üzerinde yapılan tam kapsamlı güvenlik denetiminde bulunan ve düzeltilen maddeler (bkz. `todo.md`):

- Ürün görseli / teklif eki yükleme endpoint'leri (`app/api/products/upload-image`, `app/api/quotes/upload-attachment`) artık JWT imza doğrulaması (`lib/auth/verify-token.ts` — `jose.jwtVerify`), sahiplik kontrolü ve dosya tipi/boyut allowlist'i içeriyor. Bu route'lar `proxy.ts`'nin middleware'i kapsamadığı için kendi doğrulamalarını kendileri yapıyor.
- `app/api/test-reset` yalnızca `NODE_ENV !== 'production'` iken çalışıyor.
- Backend: `POST /orders`'ta `sellerId` ürünün gerçek satıcısıyla doğrulanıyor; taslak ürünler herkese değil sadece sahibine görünüyor; kimlik doğrulaması gerektirmeyen şirket verisi dökümü kaldırıldı.
- Tüm hata mesajları backend'in ham metnini göstermek yerine HTTP durum koduna göre seçilen, lokalize edilmiş metinler kullanıyor (`lib/api/client.ts`'in `apiErrorStatus()` yardımcı fonksiyonu).

---

## Testler

### Unit Testler (Vitest)

```bash
npm run test:unit          # Tek seferlik çalıştır
npm run test:unit:watch    # Watch modu
```

`lib/utils.test.ts` ve `lib/pricing.test.ts` dahil toplam **21 unit test**.

### E2E Testler (Playwright)

```bash
npm run test:e2e           # Headless
npm run test:e2e:ui        # Playwright UI modu
```

5 spec dosyası, **31 E2E test** — auth, seller ürün yönetimi, seller teklif yanıtlama, buyer sepet, buyer onay akışı.

> E2E testler çalışmadan önce geliştirme sunucusu (`npm run dev`) ve mock API server (`e2e/mock-api-server.mjs`) açık olmalıdır.
> Her test `beforeEach`'te `/api/seed` + `/api/test-reset` çağırarak veritabanını temiz duruma getirir.
> Canlı ihale (WebSocket) akışı, gerçek çok-istemcili teklif yarışları Playwright'ta güvenilir şekilde reprodüklenemediğinden E2E kapsamı dışında bırakılmıştır — bu akış backend tarafında birim testlerle (bkz. `supplyhub-api` README) ve manuel olarak doğrulanır.

---

## Proje Yapısı

```
supplyhub/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/          → Login, Signup (4 adımlı + OTP), şifre sıfırlama
│   │   ├── seller/          → Satıcı portalı sayfaları (dashboard, ürünler, teklifler, siparişler, ihaleler, alıcılar)
│   │   └── buyer/           → Alıcı portalı sayfaları (keşfet, sepet, siparişler, teklifler, ihaleler, onaylar)
│   └── api/
│       ├── auth/            → NestJS proxy (login, logout, signup, send-verification, forgot/reset-password)
│       ├── products/upload-image/    → Ürün görseli yükleme (auth + sahiplik + tip/boyut kontrollü)
│       ├── quotes/upload-attachment/ → Teklif eki yükleme (auth + tip/boyut kontrollü)
│       ├── seed/            → Demo veri oluşturma
│       └── test-reset/      → Test izolasyonu için veri sıfırlama (yalnızca production dışı)
├── components/
│   ├── ui/                  → Paylaşılan ilkel bileşenler (Button, Avatar, FormInput, AlertDialog, vb.)
│   ├── shared/               → Layout bileşenleri (Sidebar, Topbar, CountdownTimer, vb.)
│   ├── seller/               → Satıcı portalı bileşenleri (ihale monitörü dahil)
│   └── buyer/                → Alıcı portalı bileşenleri (ihale odası/teklif formu dahil)
├── lib/
│   ├── api/                  → NestJS client (auth, products, orders, quotes, auctions, reviews, companies, users)
│   ├── auth/                 → JWT decode (server + client) + gerçek imza doğrulaması (`verify-token.ts`)
│   ├── sockets/               → `auction-socket.ts` — Socket.IO bağlantısı
│   ├── stores/                 → `useAuctionStore.ts` — Zustand, canlı ihale state'i (yalnızca socket broadcast'inden güncellenir)
│   ├── pricing.ts             → Tier fiyatlandırma mantığı
│   └── utils.ts                → formatCurrency, formatDate, getInitials
├── e2e/                      → Playwright E2E testleri + mock API server
├── messages/                 → i18n çeviri dosyaları (tr / en)
├── supabase/
│   └── schema.sql            → Veritabanı şeması referansı (gerçek kaynak: `supplyhub-api/prisma/schema.prisma`)
└── .github/
    └── workflows/
        └── test.yml           → CI pipeline
```

---

## CI/CD

Her `main` push'unda GitHub Actions otomatik olarak çalışır:

```
push → Unit Tests (Vitest) → E2E Tests (Playwright) → ✅ / ❌
```

E2E testleri için CI ortamında aşağıdaki secrets tanımlanmalıdır:

| Secret | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `JWT_ACCESS_SECRET` | NestJS JWT secret |
| `TEST_PASSWORD` | Demo hesap şifresi |

---

## Veri Modeli

Gerçek kaynak backend'deki `prisma/schema.prisma`'dır; özet:

```
companies       id, name, type ('seller' | 'buyer'), free_shipping_threshold, shipping_fee
users           id, company_id, email, role, name, password_hash
products        id, seller_id, name, category, min_order_qty,
                price_tiers (jsonb), image_url, images[], status, stock_quantity
product_price_history  id, product_id, price, recorded_at
quote_requests  id, buyer_id, product_id, quantity, status,
                seller_response_price, seller_message, lead_time, attachment_urls
orders          id, buyer_id, seller_id, status, total,
                needs_approval, approved_by, created_by
order_items     id, order_id, product_id, quantity, unit_price
reviews         id, order_id, product_id, buyer_id, rating
notifications   id, company_id, category, type, data (jsonb), action_href, read
auctions        id, product_id, starting_price, current_price, current_bidder_id,
                bid_count, status ('active'|'ended'|'cancelled'), ends_at
bids            id, auction_id, bidder_id, amount, created_at
```

---

## Geliştirme Durumu

- [x] Seller portalı UI (Dashboard, Ürünler, Teklifler, Siparişler, Alıcılar, Canlı İhale)
- [x] Buyer portalı UI (Keşif, Sepet, Siparişler, Onaylar, RFQ, Canlı İhale)
- [x] NestJS backend (Auth, Products, Orders, QuoteRequests, Reviews, Companies, Users, Notifications, Auctions modülleri)
- [x] JWT auth + OTP e-posta doğrulama (Resend HTTP API)
- [x] RBAC (`RolesGuard`, company-based erişim kontrolü)
- [x] Tüm veri sorguları NestJS'e taşındı (Supabase'e doğrudan erişim yalnızca 3 server-only upload/test route'unda kalıyor)
- [x] Canlı açık artırma ihalesi — WebSocket (Socket.IO), Postgres atomik güncellemeyle teklif çakışması koruması, otomatik ihale sonlandırma
- [x] Tam kapsamlı güvenlik denetimi ve düzeltmeleri (bkz. Güvenlik bölümü)
- [x] i18n (Türkçe / İngilizce), tüm hata mesajları dile göre lokalize
- [x] Unit + E2E test suite
- [x] GitHub Actions CI/CD
- [x] Production deploy (Vercel + Railway)

---

## Lisans

MIT
