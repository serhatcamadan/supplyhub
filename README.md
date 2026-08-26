# SupplyHub

![Test Suite](https://github.com/serhatcamadan/supplyhub/actions/workflows/test.yml/badge.svg?branch=dev)

**B2B toptan tedarik platformu** — Satıcılar (tedarikçiler) ile alıcıları (perakendeciler, restoranlar, üreticiler) buluşturan full-stack portföy projesi.

Kademeli fiyatlandırma, teklif pazarlığı (RFQ) ve kurumsal onay akışı gibi gerçek B2B karmaşıklıklarını modellemek amacıyla geliştirildi.

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript (strict) |
| Stil | Tailwind CSS v4 + shadcn/ui |
| Backend / DB | Supabase (Auth, PostgreSQL, Realtime) |
| Form & Validasyon | react-hook-form + Zod v4 |
| Grafikler | Recharts |
| i18n | next-intl (TR / EN) |
| Test | Vitest (unit) + Playwright (E2E) |
| CI/CD | GitHub Actions |
| Deploy | Vercel |

---

## Özellikler

### Satıcı Portalı (`/seller`)

- **Dashboard** — Gelir grafiği (Recharts), KPI kartları, aktivite akışı, en çok satan ürünler
- **Ürün Yönetimi** — Ürün listesi, yeni ürün formu, kademeli fiyatlandırma (price tiers), medya yükleme
- **Teklif Talepleri (RFQ)** — Alıcıdan gelen teklifleri yanıtlama, canlı toplam hesaplama, taslak kaydetme
- **Sipariş Yönetimi** — Sipariş durumu takibi (Bekliyor → Onaylandı → Kargoda → Teslim Edildi)

### Alıcı Portalı (`/buyer`)

- **Ürün Keşfi** — Kategori filtreleme, ürün detay sayfası, görsel galeri, satıcı bilgisi
- **Sipariş Paneli** — Adet seçici (min. sipariş korumalı), tier fiyatı otomatik hesaplama, Sepete Ekle
- **Sepet** — Tier ilerleme çubuğu, promosyon nudge banner, ücretsiz kargo eşiği, KDV hesaplama
- **Teklif Talebi (RFQ)** — Hedef fiyat, teslimat tarihi, tedarikçi bilgisi
- **Sipariş Geçmişi** — Teslim edilen, kargodaki, onaylanan siparişler
- **Onay Yönetimi** — Staff'in bütçe limitini aşan siparişleri admin onayına sunar

### Kimlik Doğrulama & Yetkilendirme

- Supabase Auth entegrasyonu
- RBAC: `seller`, `buyer/admin`, `buyer/staff` rolleri
- Route koruması (`proxy.ts`) — yetkisiz erişimi otomatik yönlendirir

---

## Kurulum

### Gereksinimler

- Node.js 22+
- npm 10+
- Supabase hesabı

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/serhatcamadan/supplyhub.git
cd supplyhub

# 2. Bağımlılıkları kur
npm install

# 3. Ortam değişkenlerini tanımla
cp .env.example .env.local
# .env.local dosyasına Supabase URL ve key'lerini ekle

# 4. Veritabanını hazırla
# supabase/schema.sql dosyasını Supabase SQL Editor'da çalıştır
# Ardından demo verileri oluştur:
curl -X POST http://localhost:3000/api/seed

# 5. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

### Ortam Değişkenleri

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Demo Hesapları

Seed API çalıştırıldıktan sonra aşağıdaki hesaplarla giriş yapılabilir (şifre: `Demo1234!`):

| E-posta | Portal | Rol |
|---|---|---|
| `ali@freshfarm.com` | Satıcı | Admin |
| `ayse@gunespazar.com` | Alıcı | Admin |
| `fatma@gunespazar.com` | Alıcı | Staff |
| `kemal@lezzet.com` | Alıcı | Admin |

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

> E2E testler çalışmadan önce geliştirme sunucusunun (`npm run dev`) açık olması gerekir.
> Her test `beforeEach`'te `/api/test-reset` endpoint'ini çağırarak veritabanını temiz duruma getirir.

---

## Proje Yapısı

```
supplyhub/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/          → Login, Signup
│   │   ├── seller/          → Satıcı portalı sayfaları
│   │   └── buyer/           → Alıcı portalı sayfaları
│   └── api/
│       ├── seed/            → Demo veri oluşturma
│       └── test-reset/      → Test izolasyonu için veri sıfırlama
├── components/
│   ├── ui/                  → Paylaşılan ilkel bileşenler (Button, Avatar, vb.)
│   ├── shared/              → Layout bileşenleri (Sidebar, Topbar, vb.)
│   ├── seller/              → Satıcı portalı bileşenleri
│   └── buyer/               → Alıcı portalı bileşenleri
├── lib/
│   ├── mock-data/           → Tip-uyumlu mock veri
│   ├── pricing.ts           → Tier fiyatlandırma mantığı
│   └── utils.ts             → formatCurrency, formatDate, getInitials
├── e2e/                     → Playwright E2E testleri
├── messages/                → i18n çeviri dosyaları (tr / en)
├── supabase/
│   └── schema.sql           → Veritabanı şeması
└── .github/
    └── workflows/
        └── test.yml         → CI pipeline
```

---

## CI/CD

Her `dev` ve `main` push'unda GitHub Actions otomatik olarak çalışır:

```
push → Unit Tests (Vitest) → E2E Tests (Playwright) → ✅ / ❌
```

E2E testleri için CI ortamında aşağıdaki secrets tanımlanmalıdır:

| Secret | Açıklama |
|---|---|
| `TEST_SUPABASE_URL` | Supabase proje URL'i |
| `TEST_SUPABASE_ANON_KEY` | Supabase anon key |
| `TEST_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `TEST_PASSWORD` | Demo hesap şifresi |

---

## Veri Modeli

```
companies       id, name, type ('seller' | 'buyer')
users           id, company_id, email, role, name
products        id, seller_id, name, category, min_order_qty,
                price_tiers (jsonb), image_url, status
quote_requests  id, buyer_id, product_id, quantity, status,
                seller_response_price, seller_message
orders          id, buyer_id, seller_id, status, total,
                needs_approval, approved_by, created_by
order_items     id, order_id, product_id, quantity, unit_price
```

---

## Geliştirme Durumu

- [x] Seller portalı UI (Dashboard, Ürünler, Teklifler, Siparişler)
- [x] Buyer portalı UI (Keşif, Sepet, Siparişler, Onaylar, RFQ)
- [x] Supabase Auth entegrasyonu
- [x] i18n (Türkçe / İngilizce)
- [x] Unit + E2E test suite
- [x] GitHub Actions CI/CD
- [ ] Seller & Buyer sayfalarını Supabase sorgularına bağlama (mock → gerçek veri)

---

## Lisans

MIT
