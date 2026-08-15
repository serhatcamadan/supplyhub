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
| Backend / DB | Supabase (Auth, Postgres, Realtime, Storage) — Auth + seed entegre edildi |
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
    ├── quotes/
    │   ├── page.tsx            → /buyer/quotes  (→ redirect /buyer/quotes/new)
    │   └── new/page.tsx        → /buyer/quotes/new  (RFQ form)
    └── approvals/page.tsx      → /buyer/approvals
```

> **Not:** Satıcı ve alıcı route'ları route group değil gerçek dizin — `/orders` gibi ortak URL'ler çakışmasın diye. Auth hâlâ `(auth)` route group.

## Bileşen Mimarisi

```
components/
├── ui/                         → shadcn + form primitifleri + paylaşılan ilkeller
│   ├── button.tsx              → cva tabanlı Button + export buttonVariants (Link için)
│   │                              variants: primary | secondary | ghost | outline | destructive | icon
│   │                              sizes: sm | md | lg
│   ├── avatar.tsx              → getInitials + boyut/renk prop'ları — tüm avatar'lar burada
│   │                              sizes: sm(w-8) | md(w-10) | lg(w-12) | xl(w-16)
│   │                              colorSchemes: secondary | surface | primary
│   │                              className override (cycling colors için)
│   ├── table-pagination.tsx    → "Showing X of Y" footer — label: string prop
│   ├── section-heading.tsx     → h2 icon+label — className ile mb override edilebilir
│   ├── table-empty-row.tsx     → icon + message + colSpan — tablo boş durumu
│   ├── form-error.tsx          → kırmızı hata paragrafı (role="alert")
│   ├── form-input.tsx          → forwardRef, error prop, ring-2 ring-error
│   └── form-select.tsx         → forwardRef, options[], error prop
├── shared/
│   ├── sidebar.tsx             → 'use client' — fixed, usePathname ile aktif nav
│   │                              portal: 'seller' | 'buyer' prop — her portal kendi nav'ını görür
│   ├── topbar.tsx              → server component, arama + NotificationBell + ProfileButton
│   ├── notification-bell.tsx   → 'use client' — bell toggle, dropdown (scale+opacity anim), mark-all-read state
│   │                              MOCK_NOTIFICATIONS: 4 item (2 unread), click-outside useEffect ile kapatma
│   ├── notification-item.tsx   → pure — FullNotification type (exported), unread accent bar, action buttons
│   ├── notification-filter-sidebar.tsx → pure — FilterType + FILTERS (exported), search + category nav + settings card
│   ├── notifications-page.tsx  → 'use client' — orchestrator: state + INITIAL data + NotificationItem + NotificationFilterSidebar
│   └── profile-button.tsx      → 'use client' — sağdan açılan drawer, Supabase signOut
├── buyer/
│   ├── category-chips.tsx      → pure — categories[], selected, onSelect props
│   ├── product-card.tsx        → pure — product, sellerName, rating, unit, badge?, favorited?
│   │                              ProductBadge type: {label, colorScheme: 'secondary'|'primary'}
│   ├── product-image-gallery.tsx → 'use client' — 4:3 main image + 3 thumbnail, zoom overlay
│   ├── product-tabs.tsx        → 'use client' — Tab: 'overview'|'specs'|'docs'; features list
│   ├── product-order-panel.tsx → 'use client' — qty stepper, getUnitPrice/getTotalPrice, imports TierRow
│   ├── tier-row.tsx            → pure — PriceTier prop, range label + savings pct display
│   ├── seller-info-card.tsx    → pure — Avatar(lg,primary), 2-col stats grid
│   ├── cart-item.tsx           → pure — CartItem type (exported), SKU/stock badge, qty stepper, tier progress bar
│   ├── cart-promo-banner.tsx   → pure — CartItem prop, bulk-discount nudge + "Hemen Ekle" link
│   ├── order-summary.tsx       → 'use client' — promo input state, cost breakdown, checkout/quote btns
│   ├── order-stat-cards.tsx    → 3 stat kartı (Total Orders, Total Spend, In Transit)
│   ├── order-history-table.tsx → sipariş geçmişi tablosu (Avatar,TablePagination,TableEmptyRow)
│   ├── approval-card.tsx       → onay bekleyen sipariş kartı — seller+user avatar, items table, Approve/Reject
│   ├── rfq-product-card.tsx    → pure — Product + Company props, SKU/fiyat/stok badge
│   └── rfq-supplier-sidebar.tsx → pure — Company + stats[], Supplier Info (Avatar,buttonVariants) + Buyer Protection kartı
└── seller/
    ├── stat-cards.tsx          → 4 KPI kartı (sparkline SVG dahil)
    ├── top-products.tsx        → ürün listesi + donut SVG
    ├── activity-feed.tsx       → timeline feed (orders + quote)
    ├── revenue-chart.tsx       → Recharts çizgi grafiği
    ├── product-controls.tsx    → 'use client' — arama + filtre bar
    ├── product-table.tsx       → ürün tablosu (imports StockBar + ProductRowActions, pagination)
    ├── stock-bar.tsx           → pure — productId prop, MOCK_STOCK lookup, stok bar + label
    ├── product-row-actions.tsx → pure — productId prop, edit/view/more hover action buttons
    ├── status-badge.tsx        → active/draft/inactive badge
    ├── table-controls.tsx      → 'use client' — GENERIC tab bar + arama; sellers/quotes+orders paylaşıyor
    │                              tabs: TabItem[], activeTab, onTabChange, search, onSearchChange
    ├── quote-table.tsx         → RFQ tablosu (EnrichedQuote tipi + Avatar + TablePagination + TableEmptyRow)
    ├── quote-detail-panel.tsx  → sol panel: Avatar(xl) alıcı bilgisi, ürün tablosu, mesaj
    ├── quote-response-form.tsx → 'use client' — sağ panel: fiyat/mesaj formu, canlı toplam; imports QuoteSentScreen
    ├── quote-sent-screen.tsx   → pure — "Quote Sent!" success screen, Back to Quotes link
    ├── order-table.tsx         → sipariş tablosu (Avatar cycling colors, TablePagination, TableEmptyRow)
    ├── product-basic-info.tsx  → SectionHeading(info) + ad, kategori, min sipariş, açıklama
    ├── product-pricing-tiers.tsx → SectionHeading(payments,mb-0) + tier tablosu, props: tiers + 4 handler
    ├── product-media.tsx       → 'use client' — SectionHeading(image) + dropzone + resim önizleme
    └── product-logistics.tsx   → 'use client' — SectionHeading(local_shipping) + toggle + ağırlık + lead time
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

Sidebar: `'use client'`, `usePathname()` ile aktif item tespiti. `portal: 'seller' | 'buyer'` prop'u alır — her portal yalnızca kendi nav öğelerini görür. Sign Out butonu `hover:bg-error/10 hover:text-error`.

`ProfileButton` (`components/shared/profile-button.tsx`): sağdan kayan drawer (z-50, `translate-x-full → translate-x-0`), Supabase `auth.signOut()` çağırır, `/login`'e yönlendirir.

## Kodlama Konvansiyonları

### Mevcut Component'ları Kullan — Asla Yeniden Yazma

> **Kural:** Yeni bir sayfa veya bileşen eklerken, aşağıdaki shared component'ları ham HTML ile yeniden yazmak yasaktır. Her zaman import edip kullan.

| İhtiyaç | Kullanılacak | Nereden |
|---|---|---|
| Buton (her türlü) | `<Button variant size>` veya Link için `buttonVariants()` | `@/components/ui/button` |
| Avatar / baş harf daire | `<Avatar name size colorScheme>` | `@/components/ui/avatar` |
| Tablo sayfalama footer | `<TablePagination label>` | `@/components/ui/table-pagination` |
| Form bölüm başlığı (h2+ikon) | `<SectionHeading icon label className?>` | `@/components/ui/section-heading` |
| Tablo boş durumu | `<TableEmptyRow icon message colSpan>` | `@/components/ui/table-empty-row` |
| Tab bar + arama | `<TableControls tabs activeTab onTabChange search onSearchChange>` | `@/components/seller/table-controls` |
| Baş harf üretme | `getInitials(name)` | `@/lib/utils` |
| Para formatı | `formatCurrency(value)` | `@/lib/utils` |
| Tarih formatı | `formatDate(value)` | `@/lib/utils` |
| Class birleştirme | `cn(...classes)` | `@/lib/utils` |

**Kontrol listesi — her yeni dosyada:**
- `<button>` yazmadan önce `Button` var mı? → `@/components/ui/button`
- `<div className="rounded-full flex items-center...">` yazmadan önce `Avatar` var mı? → `@/components/ui/avatar`
- Bir fonksiyon `name.split(' ').map(...)` benzeri baş harf üretiyorsa `getInitials` kullan
- Yeni component'a geçmeden önce `components/ui/` ve ilgili domain klasörünü tara

- **Server component varsayılan** — interaktivite (useState, event handler) gerektiğinde `'use client'`
- **Dinamik route params** Next.js 16'da `Promise<{id: string}>` — `await params` kullan
- **Pricing mantığı:** `lib/pricing.ts` — tier hesaplama, `lib/pricing.test.ts` ile test edilmiş
- **Mock data:** `lib/mock-data/` — her entity için ayrı dosya, `index.ts` re-export
- **`lib/utils.ts`:** `cn()`, `formatCurrency()` (TRY), `formatDate()` (tr-TR locale), `getInitials(name)` — 2 harfli baş harf; tüm avatar'larda buradan kullanılır; yerel kopya yazılmaz
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
`'use client'` (tab + search state). 4 stat kartı (total, pending, conversion rate, pipeline). `TableControls` (tab: All/Pending/Responded/Archived) + `QuoteTable` (buyer avatar, ürün, miktar, durum badge, hover actions).

### Quotes — Detay (`/seller/quotes/[id]`)
Async server component (`await params`). İki panel layout (`h-[calc(100vh-4rem)]`, `min-h-0` ile iç scroll):
- **Sol panel** (`QuoteDetailPanel`): alıcı avatar+bilgi, ürün mini-tablosu, alıcı mesajı
- **Sağ panel** (`QuoteResponseForm`, `'use client'`): birim fiyat input → canlı toplam, lead time select, geçerlilik tarihi, mesaj textarea, Save Draft / Send Quote. "Sent" başarı ekranı.

### Orders (`/seller/orders`)
`'use client'` (tab + search state). 4 stat kartı (total, awaiting action, in transit, total revenue). `TableControls` (tab: All/Pending/Confirmed/Shipped/Delivered) + `OrderTable` (buyer avatar+email, order ID, tarih, items özeti, toplam, durum badge, hover action buttons: Confirm/Ship/Deliver statüye göre).

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

## Supabase Entegrasyonu

**Durum:** Auth + seed tamamlandı; veri sorguları hâlâ mock.

| Dosya | Açıklama |
|---|---|
| `lib/supabase/client.ts` | Browser client (`createBrowserClient`) |
| `lib/supabase/server.ts` | Server client (`createServerClient`, cookies) |
| `lib/supabase/types.ts` | `Database` tip ağacı — tüm tablolar + `Relationships: []` |
| `supabase/schema.sql` | 6 tablo DDL (auth.users'a dokunmaz) |
| `app/api/seed/route.ts` | POST — idempotent seed; `auth.admin.createUser()` ile 4 demo hesap |
| `app/api/auth/signup/route.ts` | POST — yeni kullanıcı kaydı |

**Demo hesaplar (şifre: `Demo1234!`):**
- `ali@freshfarm.com` → seller/admin (FreshFarm Gıda)
- `ayse@gunespazar.com` → buyer/admin (Güneş Pazarı)
- `fatma@gunespazar.com` → buyer/staff (Güneş Pazarı)
- `kemal@lezzet.com` → buyer/admin (Lezzet Restoranları)

**Güvenlik:** `SUPABASE_SERVICE_ROLE_KEY` yalnızca server API route'larında. `NEXT_PUBLIC_` prefix'i ASLA eklenmez.

## Buyer Portal — Tamamlanan Ekranlar

### Discover — Liste (`/buyer/discover`)
`'use client'` (selectedCategory state). `CategoryChips` (filtre) + `ProductCard` grid. RATINGS / BADGES / UNITS lookup map'leri sayfa içinde. `ProductBadge` tipi: `{label, colorScheme: 'secondary'|'primary'}`.

### Discover — Detay (`/buyer/discover/[id]`)
Async server component (`await params`). 12 sütun grid: sol 8 col (gallery + tabs), sağ 4 col (sipariş paneli + satıcı kartı). FEATURES_MAP + RATINGS_MAP sayfa içinde. SVG sparkline için `bg-linear-to-br` kullan (Tailwind v4).
- **`ProductImageGallery`**: 4:3 ana görsel + 3 thumbnail, zoom overlay
- **`ProductTabs`**: overview/specs/docs sekmeleri, `check_circle` ikonlu özellik listesi
- **`ProductOrderPanel`**: tier tablosu, qty stepper (min_order_qty korumalı), `getUnitPrice`/`getTotalPrice`/`getNextTier`
- **`SellerInfoCard`**: tedarikçi bilgisi, initials(), 2 sütunlu istatistik

### Cart (`/buyer/cart`)
`'use client'` (items state). İki panel layout: `h-[calc(100vh-4rem)]` → sol flex-1 scrollable + sağ w-96 fixed sidebar.
- `PromoBanner`: en az tier ilerleme yüzdesi olan ürün için toplu indirim nudge'ı
- `CartItemCard`: SKU badge, stock badge ('in_stock'|'low_stock'), qty stepper (minQty korumalı), fiyat (opsiyonel strikethrough), tier progress bar (alt kenar, 1px)
- `OrderSummary`: subtotal/indirim/kargo (10K TRY üzeri ücretsiz)/KDV (%20) hesaplama, promo input, "Siparişi Tamamla" + "Resmi Teklif Talep Et" butonları, trust indicators

**CartItem tipi** (`components/buyer/cart-item.tsx`):
```typescript
type CartItem = {
  id, name, sku, supplierName, imageUrl, qty, unitPrice, originalUnitPrice,
  tierLabel: string | null, stockStatus: 'in_stock'|'low_stock', tierPct: number, minQty
}
```

### Orders — Sipariş Geçmişi (`/buyer/orders`)
Server component. `getOrdersWithDetails()` → `buyer_id === 'company-buyer-1'` filtresi. 3 stat kartı (`OrderStatCards`). `OrderHistoryTable`: Sipariş No (mono primary), Tedarikçi (`Avatar` surface), Tarih, Tutar, Durum badge, "Tekrar Sipariş" hover action.
- Durum renkleri: delivered→secondary, shipped→tertiary-container, confirmed→primary-container/20, pending→surface-container-high/on-surface-variant
- Hover overlay: `bg-linear-to-br from-color/5 to-transparent opacity-0 group-hover:opacity-100`

### Quote Requests — RFQ Formu (`/buyer/quotes/new`)
`'use client'` (form state: qty, deliveryDate, targetPrice, message + charCount). 12-col grid (8 form + 4 sticky sidebar):
- **Sol panel**: 3 bölümlü form (Product Selection kart + ürün SKU/fiyat, Requirements grid + target price, Message textarea + charCounter + attach files)
- **Sağ panel**: Supplier Info card (Avatar initials, star rating, stats), Buyer Protection card (primary bg, escrow bilgisi)
- `/buyer/quotes` → redirect to `/buyer/quotes/new`
- Sidebar: "Quote Requests" → `/buyer/quotes`, "Pending Approvals" → `/buyer/approvals` (önceden hatalı eşleşmeydi, düzeltildi)

### Approvals — Onay Yönetimi (`/buyer/approvals`)
Server component. `needs_approval && !approved_by` filtresi. 3 stat kartı (Awaiting Approval, Total Items, Total Value at Stake). Her sipariş için `ApprovalCard`:
- Header: seller `Avatar`(sm,surface) + requester `Avatar`(sm,secondary) + date + order total
- Items tablosu
- Footer: "Exceeds staff spending limit" uyarısı + Reject / Approve butonları (tertiary/secondary renkler)
- Empty state: check_circle ikonu + "All caught up!" mesajı

## Mevcut Aşama

**Seller portal + Buyer portal (Discover/Cart/Orders/Approvals) UI tamamlandı. Supabase Auth entegre.**

**Tamamlanan:**
- `types/index.ts`, `lib/mock-data/`, `lib/pricing.ts`, `proxy.ts`
- `components/ui/`: `button.tsx` (cva), `avatar.tsx`, `table-pagination.tsx`, `section-heading.tsx`, `table-empty-row.tsx`
- `lib/utils.ts`: `getInitials()` eklendi — yerel kopya yazılmaz
- `components/seller/table-controls.tsx`: `order-controls.tsx` + `quote-controls.tsx` birleştirildi (silinenlerin yerini aldı)
- Auth: Login (4 demo hesap + seed butonu) + Signup (çok adımlı, Zod validasyonlu) + Supabase Auth
- Seller: Dashboard, Products (liste + new), Quotes (liste + detay/yanıt), Orders
- Buyer: Discover (liste + ürün detay), Cart, Orders, Approvals, Quote Requests (RFQ) — tümü tamamlandı

**Sıradaki (öncelik sırasıyla):**
1. Seller + Buyer sayfalarını mock data'dan Supabase sorgularına bağla
