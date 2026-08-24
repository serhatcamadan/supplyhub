# SupplyHub — Adım Adım Yapılacaklar

---

## 1. Auth & Oturum Düzeltmeleri

### ✅ 1.1 Layout'larda Hard-coded Kullanıcı Adını Kaldır
**Dosyalar:** `app/seller/layout.tsx`, `app/buyer/layout.tsx`
- Her iki layout'ta `Topbar userName="Ali Yılmaz"` ve `"Ayşe Demir"` hard-coded
- `createServerClient` ile Supabase `getUser()` çağır, `user_metadata.name` ve `user_metadata.role` props olarak geçir

### ✅ 1.2 Sidebar Sign Out'u Supabase'e Bağla
**Dosya:** `components/shared/sidebar.tsx`
- `handleLogout()` şu an `document.cookie = 'mock-session...'` siliyor
- `ProfileButton`'daki gibi `supabase.auth.signOut()` kullanacak şekilde güncelle

---

## 2. Supabase Entegrasyonu — Seller Portal

### ✅ 2.1 Seller Dashboard
**Dosya:** `app/seller/dashboard/page.tsx`
- `orders`, `products`, `quoteRequests` mock'tan geliyor
- Supabase'ten oturumdaki seller'ın verilerini çek
- `StatCards`, `RevenueChart`, `TopProducts`, `ActivityFeed` bileşenlerine gerçek veri geç

### ✅ 2.2 Seller Products Listesi
**Dosya:** `app/seller/products/page.tsx`
- `products` mock'tan geliyor; `SELLER_ID = 'company-seller-1'` hard-coded
- Supabase'ten `products where seller_id = session.user.id` sorgula

### ✅ 2.3 Seller Quotes Listesi
**Dosya:** `app/seller/quotes/page.tsx`
- `quoteRequests`, `products`, `companies` mock'tan geliyor
- Supabase'ten join sorgusuyla `QuoteRequestWithDetails` listesi çek

### ✅ 2.4 Seller Quote Detay
**Dosya:** `app/seller/quotes/[id]/page.tsx`
- `quoteRequests`, `products`, `companies` mock'tan geliyor
- Supabase'ten `id`'ye göre tek quote + ilgili product ve buyer çek

### ✅ 2.5 Seller Orders
**Dosya:** `app/seller/orders/page.tsx`
- `getOrdersWithDetails()` mock'tan geliyor
- Supabase'ten `orders where seller_id = session.user.id` sorgula, buyer bilgileriyle join'le

### ✅ 2.6 Activity Feed
**Dosya:** `components/seller/activity-feed.tsx`
- `companies` mock'tan geliyor
- Supabase'ten son siparişleri ve quote'ları çek

### ✅ 2.7 Revenue Chart
**Dosya:** `components/seller/revenue-chart.tsx`
- `SELLER_REVENUE_BY_MONTH` mock'tan geliyor
- Supabase'ten aylık teslim edilen sipariş tutarlarını aggregate ile hesapla

---

## 3. Supabase Entegrasyonu — Buyer Portal

### ✅ 3.1 Buyer Discover Listesi
**Dosya:** `app/buyer/discover/page.tsx`
- `products`, `companies` mock'tan geliyor
- Supabase'ten aktif ürünleri ve satıcı bilgilerini çek

### ✅ 3.2 Buyer Ürün Detay
**Dosya:** `app/buyer/discover/[id]/page.tsx`
- `products`, `companies` mock'tan geliyor
- Supabase'ten `id`'ye göre ürün + satıcı bilgisi çek

### ✅ 3.3 Buyer Orders
**Dosya:** `app/buyer/orders/page.tsx`
- `getOrdersWithDetails()` mock'tan geliyor; `buyer_id = 'company-buyer-1'` hard-coded
- Supabase'ten `orders where buyer_id = session.user.company_id` sorgula

### ✅ 3.4 Buyer Approvals
**Dosya:** `app/buyer/approvals/page.tsx`
- `getOrdersWithDetails()` mock'tan geliyor
- Supabase'ten `needs_approval = true AND approved_by IS NULL` sorgula
- Yalnızca `role = 'admin'` kullanıcı görebilir (proxy.ts koruması zaten var)

### ✅ 3.5 Buyer RFQ Formu — Ürün ve Satıcı Bilgisi
**Dosya:** `app/buyer/quotes/new/page.tsx`
- `products`, `companies` mock'tan geliyor
- Supabase'ten ürün ve satıcı bilgilerini çek

---

## 4. Form Submitleri — Supabase Yazma

### 4.1 Yeni Ürün Kaydet
**Dosya:** `app/seller/products/new/page.tsx`
- "Save Product" butonunun `onClick`'i yok
- Form state'inden (`tiers`, `description`, vs.) `products` tablosuna insert yap
- Başarı sonrası `/seller/products`'a yönlendir

### 4.2 Ürün Düzenleme Sayfası Oluştur
**Dosya:** `app/seller/products/[id]/edit/page.tsx` — **sayfa yok**
- `components/seller/product-row-actions.tsx`'te link var ama route yok
- `new/page.tsx` ile aynı bileşenleri kullanarak düzenleme sayfası oluştur
- Supabase'ten mevcut ürün verisini çekip formu doldur, submit'te update yap

### 4.3 Quote Yanıtını Kaydet / Gönder
**Dosya:** `components/seller/quote-response-form.tsx`
- "Save Draft" ve "Send Quote" sadece local state değiştiriyor
- "Save Draft" → `quote_requests` tablosunu `seller_response_price` ve `seller_message` ile update et
- "Send Quote" → aynı update + `status = 'responded'` olarak kaydet

### 4.4 Quote'u Reddet
**Dosya:** `app/seller/quotes/[id]/page.tsx`
- "Decline" butonu işlevsel değil
- Tıklanınca `quote_requests.status = 'declined'` olarak Supabase'e yaz

### 4.5 RFQ Formu Submit
**Dosya:** `app/buyer/quotes/new/page.tsx`
- Form submit butonu hiçbir şey yazmıyor
- `quote_requests` tablosuna insert yap, başarı sonrası `/buyer/quotes`'a yönlendir

---

## 5. Durum Güncelleme Aksiyonları

### 5.1 Seller Orders — Sipariş Durumu Güncelle
**Dosya:** `components/seller/order-table.tsx`
- "Confirm", "Ship", "Deliver" butonlarının `onClick`'i yok
- Her buton ilgili siparişi Supabase'te günceller:
  - Confirm → `status = 'confirmed'`
  - Ship → `status = 'shipped'`
  - Deliver → `status = 'delivered'`

### 5.2 Buyer Approvals — Onayla / Reddet
**Dosya:** `components/buyer/approval-card.tsx`
- "Approve" ve "Reject" butonlarının `onClick`'i yok
- Approve → `approved_by = session.user.id`, `status = 'confirmed'`
- Reject → `needs_approval = false`, sipariş silinebilir veya `status = 'declined'`

---

## 6. Cart Aksiyonları

### 6.1 Cart Checkout
**Dosya:** `app/buyer/cart/page.tsx`
- `onCheckout` şu an `alert('Ödeme akışı yakında ekleniyor…')`
- Sepet içeriğinden `orders` + `order_items` tablosuna insert yap
- `total > eşik ise needs_approval = true` mantığını uygula

### 6.2 Cart'tan Teklif Talebi
**Dosya:** `app/buyer/cart/page.tsx`
- `onRequestQuote` şu an `alert('Teklif talebi yakında ekleniyor…')`
- Sepetteki ürünlerle `/buyer/quotes/new` sayfasına yönlendir

---

## 7. UI Tutarsızlıkları — Bileşen Kuralı İhlali

### 7.1 Login Sayfası Submit Butonu
**Dosya:** `app/(auth)/login/page.tsx` — satır 111
- `<button type="submit">` ham HTML kullanıyor
- `<Button variant="primary">` olarak değiştir

### 7.2 Approvals Export Butonu
**Dosya:** `app/buyer/approvals/page.tsx` — satır 27
- Ham `<button className="h-10 ...">` kullanıyor
- `<Button variant="outline">` olarak değiştir

---

## 8. İşlevsel Eksiklikler

### 8.1 Buyer Discover Arama
**Dosya:** `app/buyer/discover/page.tsx`
- Topbar'daki global arama ile ürün listesi bağlantılı değil
- Sayfaya search state ekle, ürün listesini filtrele

### 8.2 Product Tabs İçerikleri
**Dosya:** `components/buyer/product-tabs.tsx`
- "Specs" ve "Docs" tab'ları `"yakında eklenecek"` placeholder gösteriyor
- Gerçek ürün özelliklerini ve belge listesini göster (mock veri bile olsa dolu görünmeli)

### 8.3 Buyer Orders Tekrar Sipariş
**Dosya:** `components/buyer/order-history-table.tsx`
- "Tekrar Sipariş" hover action `onClick`'i yok
- Aynı order_items'larla sepete ürün ekle veya yeni sipariş oluştur

### 8.4 Seller Discover "Ürün Ekle" Butonu
**Dosya:** `app/seller/discover/page.tsx`
- Sağ üstteki "Ürün Ekle" butonu no-op
- `/seller/products/new`'e yönlendir

---

## 9. Polish

### 9.1 Quote Detay Print
**Dosya:** `app/seller/quotes/[id]/page.tsx`
- "Print" butonu işlevsel değil
- `window.print()` çağır veya kaldır

### 9.2 Buyer Orders "CSV İndir"
**Dosya:** `app/buyer/orders/page.tsx`
- Buton no-op; sipariş verilerini CSV olarak indiren basit bir export ekle

### 9.3 Notification Bell Aksiyonları
**Dosya:** `components/shared/notification-bell.tsx`
- "View Quote", "Track Shipment" gibi aksiyon butonları ilgili sayfalara yönlendirmeli

### 9.4 ProfileButton Ayar Linkleri
**Dosya:** `components/shared/profile-button.tsx`
- Tüm menü öğeleri `href="#"` — gerçek sayfalar oluşturulana kadar toast veya `router.push` ekle

### 9.5 "Generate AI Draft" Butonu
**Dosya:** `components/seller/quote-response-form.tsx`
- Claude API entegrasyonu yapılmayacaksa butonu kaldır; yapılacaksa API rotası oluştur
