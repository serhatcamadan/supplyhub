@AGENTS.md

# SupplyHub — CLAUDE.md

## Proje Amacı

**SupplyHub**, satıcı (tedarikçi) ile alıcı (perakendeci/restoran/üretici) işletmelerini buluşturan bir **B2B toptan tedarik platformu** (portfolyo projesi). Temel teknik hedef: kademeli fiyatlandırma, teklif pazarlığı (RFQ) ve kurumsal onay akışı gibi gerçek B2B karmaşıklığını doğru modellemek.

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js App Router |
| Dil | TypeScript (strict mode) |
| Stil | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (Auth, Postgres, Realtime, Storage) |
| Form / Validasyon | react-hook-form + zod |
| Grafikler | Recharts |
| Deploy | Vercel |

## Geliştirme Yaklaşımı

**UI-first**: Önce tüm ekranlar mock (sahte) veriyle inşa edilir; sonra Supabase entegrasyonu yapılır. Mock verinin tipleri, gerçek DB şemasıyla birebir aynı olmalı — backend'e geçişte JSX değişmez, sadece veri kaynağı değişir.

**Tasarım dili:** Profesyonel B2B SaaS (Linear/Stripe Dashboard estetiği). Koyu lacivert/slate-blue ana renk; yeşil = pozitif aksiyonlar, amber = bekleyen durumlar. Veri yoğun ama ferah tablo/kart düzeni.

## Kullanıcı Rolleri

| Portal | Rol | Yetkiler |
|---|---|---|
| Satıcı | — | Ürün ekle/düzenle, RFQ yanıtla, sipariş yönet, satış analitiği |
| Alıcı | `admin` | Tüm alıcı işlemleri + sipariş onaylama |
| Alıcı | `staff` | Sepet, teklif talebi, sipariş oluşturma (limitin üstü onay bekler) |

## Veri Modeli

```
companies       id, name, type ('seller' | 'buyer')

users           id, company_id, email, role ('admin' | 'staff')

products        id, seller_id, name, description, category,
                min_order_qty, price_tiers (jsonb: [{min_qty, max_qty, price}]),
                image_url, status ('active' | 'draft')

quote_requests  id, buyer_id, product_id, quantity, buyer_note,
                status ('pending' | 'responded' | 'accepted' | 'declined'),
                seller_response_price, seller_message

orders          id, buyer_id, seller_id,
                status ('pending' | 'confirmed' | 'shipped' | 'delivered'),
                total, needs_approval (bool),
                approved_by (FK -> users, nullable), created_by (FK -> users)

order_items     id, order_id, product_id, quantity, unit_price
```

## Ekranlar

**Auth:** `app/(auth)/` — Login (`/login`), Signup (`/signup`)

**Satıcı:** `app/seller/` — Dashboard (`/seller/dashboard`), Ürün Listesi (`/seller/products`), Yeni Ürün (`/seller/products/new`), RFQ Listesi (`/seller/quotes`), Sipariş Listesi (`/seller/orders`)

**Alıcı:** `app/buyer/` — Ürün Keşfi (`/buyer/discover`), Ürün Detay (`/buyer/discover/[id]`), Sepet (`/buyer/cart`), Sipariş Geçmişi (`/buyer/orders`), Onay Bekleyenler (`/buyer/approvals`)

**Ortak:** Realtime bildirim dropdown'ı (henüz yapılmadı)

> **Not:** Satıcı ve alıcı route'ları `(seller)`/`(buyer)` route group yerine `app/seller/` ve `app/buyer/` gerçek dizinlerinde. Aksi takdirde her iki portalın `/orders` gibi ortak adlı sayfaları URL'de çakışıyor. Auth hâlâ `(auth)` route group kullanıyor — login/signup benzersiz URL'ler.

## Kodlama Konvansiyonları

- **Route yapısı:** `app/(auth)/`, `app/seller/`, `app/buyer/` (bkz. yukarıdaki not)
- **Server component varsayılan**; interaktivite gerektiğinde `'use client'`
- **Merkezi tipler:** `types/index.ts` — tüm DB tipler buraya, mock data bu tipleri kullanır
- **RBAC / Route koruması:** `proxy.ts` — Next.js 16'da `middleware.ts` kaldırıldı, yerine `proxy.ts` geldi; export edilen fonksiyon adı `proxy` (eski: `middleware`)
- **Pricing mantığı:** `lib/pricing.ts` — kademeli fiyat hesaplama, unit test'li (`lib/pricing.test.ts`)
- **Bileşenler:**
  - `components/ui/` → shadcn bileşenleri
  - `components/seller/` → satıcı portalına özel
  - `components/buyer/` → alıcı portalına özel
  - `components/shared/` → her iki portalda ortak (örn. `sidebar.tsx`)
- **Mock data:** `lib/mock-data/` klasörü, her entity için ayrı dosya; `index.ts` ile re-export
- **Test dosyaları** `tsconfig.json`'dan exclude edilmiş — `**/*.test.ts` derlemeye dahil değil

## Form Validasyonu

**Kütüphaneler:** Zod v4 + react-hook-form + @hookform/resolvers

**Yaklaşım:** Her step için ayrı `useForm` instance'ı; `zodResolver` ile şema bağlanır.

**Zod v4 sözdizimi:**
```typescript
z.string().min(2, 'Mesaj')   // kısa sözdizimi çalışıyor
z.string().email('Mesaj')    // e-posta
```

**Hata gösterimi:** `FormError` bileşeni (`components/ui/form-error.tsx`) — input altında kırmızı kutucuk, `*` öneki ile mesaj. `FormInput` ve `FormSelect` doğrudan `error?: string` prop'u alır; geçildiğinde border kırmızı olur ve `FormError` render edilir.

**Rol validasyonu (Step 2):** Rol seçimi `useForm` dışında `useState` ile yönetilir; Continue butonuna basıldığında `roleError` state'i set edilir, `FormError` ekranda gösterilir.

**Reusable bileşenler:**
- `components/ui/form-input.tsx` — `forwardRef` + `InputHTMLAttributes` spread + `error?: string`
- `components/ui/form-select.tsx` — `forwardRef` + `SelectHTMLAttributes` spread + `options: {value, label}[]` + `error?: string`
- `components/ui/form-error.tsx` — hata kutucuğu (doğrudan kullanım veya yukarıdaki bileşenler aracılığıyla)

## Next.js 16 Kırıcı Değişiklikler

| Eski | Yeni | Notlar |
|---|---|---|
| `middleware.ts` | `proxy.ts` | Fonksiyon adı da `middleware` → `proxy` |
| `export function middleware()` | `export function proxy()` | Config objesi (`matcher`) aynı kalıyor |

Codemod ile otomatik geçiş: `npx @next/codemod@canary middleware-to-proxy .`

## Mevcut Aşama

UI katmanı tamamlandı (mock data ile). Sıradaki adım Supabase entegrasyonu.

**Tamamlanan:**
- `types/index.ts` — tüm DB tipleri
- `lib/mock-data/` — şirketler, kullanıcılar, ürünler, siparişler, teklifler
- `lib/pricing.ts` + `lib/pricing.test.ts`
- `proxy.ts` — RBAC route koruması
- Auth ekranları (Login demo hesaplar + Signup)
- Satıcı paneli: Dashboard, Ürünler, RFQ, Siparişler
- Alıcı paneli: Keşif, Ürün Detay, Sepet, Siparişler, Onaylar

**Sıradaki:**
1. Supabase projesi oluştur, `.env.local` ayarla
2. DB şemasını Supabase'e uygula (SQL migration)
3. Mock data'yı Supabase sorgularıyla değiştir
4. Supabase Auth ile gerçek oturum yönetimi (`proxy.ts` cookie kontrolünü güncelle)
5. Realtime bildirim dropdown'ı
