@AGENTS.md

# SupplyHub — CLAUDE.md

## Proje Amacı

**SupplyHub**, satıcı (tedarikçi) ile alıcı (perakendeci/restoran/üretici) işletmelerini buluşturan bir **B2B toptan tedarik platformu** (portfolyo projesi). Temel teknik hedef: kademeli fiyatlandırma, teklif pazarlığı (RFQ) ve kurumsal onay akışı gibi gerçek B2B karmaşıklığını doğru modellemek.

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 App Router |
| Dil | TypeScript (strict mode) |
| Stil | Tailwind CSS v4 + shadcn/ui |
| Backend / DB | Supabase (Auth, Postgres, Realtime, Storage) — henüz entegre değil |
| Form / Validasyon | react-hook-form + zod v4 + @hookform/resolvers |
| Grafikler | Recharts |
| İkonlar | Material Symbols Outlined (CDN, `app/layout.tsx` `<head>`) |
| Deploy | Vercel |

## Geliştirme Yaklaşımı

**UI-first**: Önce tüm ekranlar mock (sahte) veriyle inşa edilir; sonra Supabase entegrasyonu yapılır. Mock verinin tipleri, gerçek DB şemasıyla birebir aynı olmalı — backend'e geçişte JSX değişmez, sadece veri kaynağı değişir.

**Tasarım dili:** Profesyonel B2B SaaS (Linear/Stripe Dashboard estetiği). Koyu lacivert/slate-blue ana renk (`primary: #022448`); yeşil = pozitif aksiyonlar (`secondary`), amber = bekleyen durumlar (`tertiary`). Veri yoğun ama ferah tablo/kart düzeni.

## Kullanıcı Rolleri

| Portal | Rol | Yetkiler |
|---|---|---|
| Satıcı | — | Ürün ekle/düzenle, RFQ yanıtla, sipariş yönet, satış analitiği |
| Alıcı | `admin` | Tüm alıcı işlemleri + sipariş onaylama |
| Alıcı | `staff` | Sepet, teklif talebi, sipariş oluşturma (limitin üstü onay bekler) |

## Veri Modeli

```
companies       id, name, type ('seller' | 'buyer')

users           id, company_id, email, role ('admin' | 'staff'), name

products        id, seller_id, name, description, category,
                min_order_qty, price_tiers (jsonb: [{min_qty, max_qty, price}]),
                image_url, status ('active' | 'draft')

quote_requests  id, buyer_id, product_id, quantity, buyer_note,
                status ('pending' | 'responded' | 'accepted' | 'declined'),
                seller_response_price, seller_message, created_at

orders          id, buyer_id, seller_id,
                status ('pending' | 'confirmed' | 'shipped' | 'delivered'),
                total, needs_approval (bool),
                approved_by (FK -> users, nullable), created_by (FK -> users),
                created_at

order_items     id, order_id, product_id, quantity, unit_price
```

Tüm tipler `types/index.ts`'de tanımlı. Join/enrich edilmiş UI tipleri (`QuoteRequestWithDetails`, `OrderWithDetails` vb.) de oradadır.

## Route Yapısı ve Ekranlar

```
app/
├── (auth)/
│   ├── login/page.tsx          → /login
│   └── signup/page.tsx         → /signup
├── seller/
│   ├── layout.tsx              → Sidebar + Topbar layout
│   ├── dashboard/page.tsx      → /seller/dashboard
│   ├── products/
│   │   ├── page.tsx            → /seller/products
│   │   └── new/page.tsx        → /seller/products/new
│   ├── quotes/
│   │   ├── page.tsx            → /seller/quotes  (liste)
│   │   └── [id]/page.tsx       → /seller/quotes/[id]  (detay + yanıt formu)
│   └── orders/page.tsx         → /seller/orders
└── buyer/
    ├── layout.tsx              → Sidebar + Topbar layout
    ├── discover/
    │   ├── page.tsx            → /buyer/discover
    │   └── [id]/page.tsx       → /buyer/discover/[id]
    ├── cart/page.tsx           → /buyer/cart
    ├── orders/page.tsx         → /buyer/orders
    └── approvals/page.tsx      → /buyer/approvals
```

> **Not:** Satıcı ve alıcı route'ları route group değil gerçek dizin — `/orders` gibi ortak URL'ler çakışmasın diye. Auth hâlâ `(auth)` route group.

## Bileşen Mimarisi

```
components/
├── ui/                         → shadcn + form primitifleri
│   ├── form-error.tsx          → kırmızı hata paragrafı (role="alert")
│   ├── form-input.tsx          → forwardRef, error prop, ring-2 ring-error
│   └── form-select.tsx         → forwardRef, options[], error prop
├── shared/
│   ├── sidebar.tsx             → 'use client' — fixed, usePathname ile aktif nav
│   └── topbar.tsx              → server component, arama + bildirim + avatar
└── seller/
    ├── stat-cards.tsx          → 4 KPI kartı (sparkline SVG dahil)
    ├── top-products.tsx        → ürün listesi + donut SVG
    ├── activity-feed.tsx       → timeline feed (orders + quote)
    ├── revenue-chart.tsx       → Recharts çizgi grafiği
    ├── product-controls.tsx    → 'use client' — arama + filtre bar
    ├── product-table.tsx       → ürün tablosu (MOCK_STOCK, StockBar, RowActions, pagination)
    ├── status-badge.tsx        → active/draft/inactive badge
    ├── quote-controls.tsx      → 'use client' — tab bar + arama
    ├── quote-table.tsx         → RFQ tablosu (EnrichedQuote tipi + pagination)
    ├── quote-detail-panel.tsx  → sol panel: alıcı bilgisi, ürün tablosu, mesaj
    ├── quote-response-form.tsx → 'use client' — sağ panel: fiyat/mesaj formu, canlı toplam
    ├── order-controls.tsx      → 'use client' — tab bar (All/Pending/Confirmed/Shipped/Delivered) + arama
    ├── order-table.tsx         → sipariş tablosu (OrderWithDetails, StatusBadge, hover actions, pagination)
    ├── product-basic-info.tsx  → ürün adı, kategori, min sipariş adedi, açıklama + char counter
    ├── product-pricing-tiers.tsx → 'use client' içermiyor; tier tablosu, props: tiers + 4 handler
    ├── product-media.tsx       → 'use client' — dropzone + resim önizleme (kendi state'i)
    └── product-logistics.tsx   → 'use client' — aktif toggle + ağırlık + lead time (kendi state'i)
```

## Layout Sistemi

`app/seller/layout.tsx` ve `app/buyer/layout.tsx` her ikisi de aynı şablonu kullanır:
```tsx
<div>
  <Sidebar />                             // fixed left-0 w-72 bg-primary
  <Topbar userName="..." userRole="..." />// fixed top-0 left-72 right-0 h-16
  <div className="pl-72">
    <main className="pt-16">{children}</main>
  </div>
</div>
```

Sidebar: `'use client'`, `usePathname()` ile aktif item tespiti. Her iki portal nav'ı her zaman görünür (portfolyo avantajı). Sign Out butonu `hover:bg-error/10 hover:text-error`.

## Kodlama Konvansiyonları

- **Server component varsayılan** — interaktivite (useState, event handler) gerektiğinde `'use client'`
- **Dinamik route params** Next.js 16'da `Promise<{id: string}>` — `await params` kullan
- **Pricing mantığı:** `lib/pricing.ts` — tier hesaplama, `lib/pricing.test.ts` ile test edilmiş
- **Mock data:** `lib/mock-data/` — her entity için ayrı dosya, `index.ts` re-export
- **`lib/utils.ts`:** `cn()`, `formatCurrency()` (TRY), `formatDate()` (tr-TR locale)
- **RBAC / Route koruması:** `proxy.ts` (Next.js 16 — eski adı `middleware.ts`)
- **Test dosyaları** `tsconfig.json`'dan exclude edilmiş

## Form Validasyonu

**Kütüphaneler:** Zod v4 + react-hook-form + @hookform/resolvers

**Yaklaşım:** Her step için ayrı `useForm` instance'ı; `zodResolver` ile şema bağlanır.

**Zod v4 sözdizimi:**
```typescript
z.string().min(2, 'Mesaj')
z.string().email('Mesaj')
```

**Hata gösterimi:** `FormError` — plain kırmızı `<p role="alert">`, ikon yok, kutu yok. `FormInput`/`FormSelect` doğrudan `error?: string` prop'u alır; hata varsa `ring-2 ring-error/60 border-error/40`.

**Rol validasyonu (Step 2):** `useForm` dışında `useState<Role>` ile yönetilir.

## Seller Portal — Tamamlanan Ekranlar

### Dashboard (`/seller/dashboard`)
Server component. Mock data'dan stats hesaplar, `StatCards` + `RevenueChart` + `TopProducts` + `ActivityFeed` bileşenlerine prop olarak geçer.

### Products (`/seller/products`)
`'use client'` (search state). `ProductControls` + `ProductTable`. Tablo: checkbox, resim, ürün bilgisi, kategori badge, fiyat aralığı (tier'lardan), stok bar (MOCK_STOCK), StatusBadge, hover actions.

### Quotes — Liste (`/seller/quotes`)
`'use client'` (tab + search state). 4 stat kartı (total, pending, conversion rate, pipeline). `QuoteControls` (tab: All/Pending/Responded/Archived) + `QuoteTable` (buyer avatar, ürün, miktar, durum badge, hover actions).

### Quotes — Detay (`/seller/quotes/[id]`)
Async server component (`await params`). İki panel layout (`h-[calc(100vh-4rem)]`, `min-h-0` ile iç scroll):
- **Sol panel** (`QuoteDetailPanel`): alıcı avatar+bilgi, ürün mini-tablosu, alıcı mesajı
- **Sağ panel** (`QuoteResponseForm`, `'use client'`): birim fiyat input → canlı toplam, lead time select, geçerlilik tarihi, mesaj textarea, Save Draft / Send Quote. "Sent" başarı ekranı.

### Orders (`/seller/orders`)
`'use client'` (tab + search state). 4 stat kartı (total, awaiting action, in transit, total revenue). `OrderControls` (tab: All/Pending/Confirmed/Shipped/Delivered) + `OrderTable` (buyer avatar+email, order ID, tarih, items özeti, toplam, durum badge, hover action buttons: Confirm/Ship/Deliver statüye göre).

### Products — New (`/seller/products/new`)
`'use client'` (tiers + description state). Sayfa 75 satır — 4 bileşene bölünmüş:
- **`ProductBasicInfo`**: ad, kategori seçimi, min sipariş adedi, açıklama (canlı char counter, 2000 limit)
- **`ProductPricingTiers`**: tier tablosu — min_qty readonly (önceki max'tan türetilir), max_qty + birim fiyat editable, Add Tier (son açık-uçlu tier'dan önce ekler), ilk tier silinemez
- **`ProductMedia`**: kendi state'i — dropzone file input, FileReader ile önizleme, Primary badge, sil
- **`ProductLogistics`**: kendi state'i — "Available for Order" toggle (secondary renk), ağırlık + lead time

## Next.js 16 Kırıcı Değişiklikler

| Eski | Yeni | Notlar |
|---|---|---|
| `middleware.ts` | `proxy.ts` | Fonksiyon adı da `middleware` → `proxy` |
| `export function middleware()` | `export function proxy()` | Config objesi (`matcher`) aynı kalıyor |
| `params: { id: string }` | `params: Promise<{ id: string }>` | Dynamic route'larda `await params` |

## Mevcut Aşama

**Seller portal UI katmanı tamamlandı.** Buyer portal ekranları var ama henüz yeniden tasarlanmadı.

**Tamamlanan:**
- `types/index.ts`, `lib/mock-data/`, `lib/pricing.ts`, `proxy.ts`
- Auth: Login (demo hesaplar) + Signup (çok adımlı, Zod validasyonlu)
- Seller: Dashboard, Products (liste + new), Quotes (liste + detay/yanıt), Orders
- Buyer: Discover, Discover/[id], Cart, Orders, Approvals — eski tasarım, yenilenmedi

**Sıradaki (öncelik sırasıyla):**
1. Buyer portal ekranlarını yenile (Discover, Discover/[id], Cart, Orders, Approvals)
2. Supabase entegrasyonu:
   - Supabase projesi oluştur, `.env.local` ayarla
   - DB şemasını SQL migration ile uygula
   - Mock data → Supabase sorguları
   - Supabase Auth + `proxy.ts` cookie kontrolü
3. Realtime bildirim dropdown'ı
