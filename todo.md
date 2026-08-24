# SupplyHub — Faz 2 Yol Haritası (Yeni Özellikler)

Mevcut proje (UI + Supabase entegrasyonu) tamamlandı. Bu doküman sıradaki
4 büyük özelliği kapsıyor. Öncelik sırası risk ve bağımlılığa göre belirlendi:
önce düşük riskli/bağımsız olanlar, sonra mimariyi değiştirenler.

**Sıralama mantığı:** i18n mevcut kodu bozmadan eklenebilir → testler backend
değişikliği öncesi güvenlik ağı sağlar → backend migrasyonu büyük ve riskli,
testler sayesinde regresyon yakalanır → chatbot en bağımsız/spekülatif olan,
en sonda ele alınır.

---

## FAZ 1 — i18next ile Çoklu Dil Desteği (TR/EN)

**Tahmini süre:** 3-4 gün
**Risk:** Düşük — mevcut mimariyi bozmaz

### 1.1 Kurulum ve Yapılandırma
- [ ] `next-i18next` yerine App Router ile uyumlu **`next-intl`** kütüphanesini
      kullanmayı değerlendir (next-i18next App Router'da sorunlu çalışıyor,
      next-intl Next.js 13+ App Router için tasarlandı ve daha az sorun çıkarır)
- [ ] `next-intl` kurulumu, `middleware.ts` içinde locale detection ekle
- [ ] `/app/[locale]/` route yapısına geçiş — mevcut tüm route'ları bu yapı
      altına taşımak gerekecek (`/app/(seller)` → `/app/[locale]/(seller)`)
- [ ] `messages/tr.json` ve `messages/en.json` dosyalarını oluştur

### 1.2 Mevcut Metinleri Çıkarma
- [ ] Tüm component'lerdeki sabit (hardcoded) Türkçe/İngilizce metinleri tara
- [ ] Her ekran için ayrı namespace kullan: `auth.json`, `seller.json`,
      `buyer.json`, `common.json` gibi bölerek çeviri dosyalarının
      şişmesini önle
- [ ] Özellikle şu alanlara dikkat et: form validasyon hata mesajları (zod
      şemalarında), status badge etiketleri (Pending/Confirmed/Shipped gibi),
      boş durum (empty state) metinleri

### 1.3 Dil Değiştirici UI
- [ ] Top bar'a bir dil değiştirici (dropdown veya toggle) ekle
- [ ] Seçilen dili cookie'de veya kullanıcı profilinde (Supabase `users`
      tablosuna `preferred_language` alanı ekleyerek) kalıcı hale getir
- [ ] Dil değiştiğinde sayfanın yeniden yüklenmeden (client-side) güncellenmesi

### 1.4 Sayı/Tarih Formatlaması
- [ ] Para birimi gösterimini locale'e göre formatla (`Intl.NumberFormat`) —
      TR'de "1.250,00 ₺" formatı, EN'de "$1,250.00" formatı
- [ ] Tarih formatlarını locale'e göre ayarla (`date-fns` locale desteği
      veya `Intl.DateTimeFormat`)

### 1.5 Test ve Kontrol
- [ ] Her iki dilde de tüm ekranları gez, taşma (overflow) kontrolü yap —
      İngilizce metinler genelde Türkçe'den kısa/uzun olabiliyor, layout
      kırılabilir
- [ ] RTL desteğine şimdilik gerek yok ama kod yapısını buna kapalı bırakma

**Not:** Bu fazı bitirdiğinde CV'de "next-intl ile i18n mimarisi kurdum,
App Router'a uyumlu route bazlı locale yönetimi yaptım" diyebilirsin — bu,
"sadece metin çevirdim"den çok daha güçlü bir teknik anlatı.

---

## FAZ 2 — Test Altyapısı (Cypress ile E2E Test)

**Tahmini süre:** 4-5 gün
**Risk:** Düşük — mevcut koda dokunmaz, üzerine eklenir
**Not:** "Cyphertest" muhtemelen **Cypress**'i kastediyor — E2E (uçtan uca)
test framework'ü. Aşağıdaki plan Cypress üzerinden ilerliyor.

### 2.1 Kurulum
- [ ] `cypress` paketini kur, `cypress.config.ts` yapılandırması
- [ ] Test ortamı için ayrı bir Supabase projesi ya da en azından ayrı bir
      test veritabanı şeması düşün (gerçek verini test'lerle kirletme)
- [ ] Test kullanıcıları (bir seller, bir buyer, bir admin) için seed script
      hazırla — her test çalıştırmasında sıfırdan oluşturulabilsin

### 2.2 Kritik Akışları Test Et (Öncelik Sırasıyla)
- [ ] **Auth akışı:** signup (her iki rol için), login, yanlış şifre hata
      mesajı, yetkisiz route erişiminin engellenmesi
- [ ] **Satıcı — ürün yönetimi:** ürün ekleme (kademeli fiyatlandırma dahil),
      düzenleme, silme
- [ ] **Alıcı — sepet ve fiyat hesaplama:** ürün miktarı değiştikçe doğru
      fiyat tier'ının uygulandığının test edilmesi (bu, en kritik iş
      mantığı olduğu için özellikle detaylı test edilmeli)
- [ ] **RFQ akışı:** alıcının teklif talep etmesi → satıcının yanıtlaması →
      alıcının teklifi görmesi
- [ ] **Sipariş ve onay akışı:** staff'ın sipariş oluşturması → belirli
      tutar üstü siparişin onay bekler duruma düşmesi → admin'in onaylaması

### 2.3 Component/Unit Test Katmanı (Opsiyonel ama Değerli)
- [ ] Kademeli fiyat hesaplama fonksiyonu (`lib/pricing.ts`) için Vitest
      veya Jest ile unit test yaz — bu fonksiyon iş mantığının kalbi,
      edge case'leri (sınır değerler: tam 10 adet, 11 adet gibi) test et
- [ ] Form validasyon şemalarının (zod) doğru çalıştığını test et

### 2.4 CI Entegrasyonu
- [ ] GitHub Actions ile her push'ta Cypress testlerinin otomatik
      çalışması (bu, CV'de "CI/CD pipeline kurdum" demeni sağlar)
- [ ] Test sonuçlarının GitHub PR'larında görünmesi

**Not:** Testleri backend migrasyonundan ÖNCE yazmanın sebebi şu: Faz 3'te
Supabase'i değiştirirken bir şey bozarsan, testler sana anında haber verir.
Testsiz büyük bir migrasyon yapmak çok riskli.

---

## FAZ 3 — Backend Migrasyonu (Supabase → NestJS/Express)

**Tahmini süre:** 2-4 hafta (projenin en büyük parçası)
**Risk:** Yüksek — auth, veri erişimi, realtime'ın hepsi yeniden yazılıyor

### 3.1 Karar: NestJS mı Express mi?
- [ ] **NestJS öneriyorum** çünkü: modüler yapısı (controller/service/module)
      büyük bir CV projesinde "enterprise-ready" mimari izlenimi verir,
      TypeScript'i native destekler, dependency injection ile test edilebilir
      kod yazdırır. Express daha minimal ama sen zaten yapılandırılmış bir
      mimariden faydalanacaksın (auth, RBAC, approval workflow gibi karmaşık
      iş mantığı var)

### 3.2 Proje İskeleti
- [ ] Ayrı bir repo/klasör: `supplyhub-api` (monorepo yapmak istersen Turborepo
      düşünebilirsin, ama başta basit tutmak için ayrı repo önerilir)
- [ ] NestJS CLI ile proje oluştur, modül yapısını planla:
      `AuthModule`, `CompaniesModule`, `ProductsModule`, `QuoteRequestsModule`,
      `OrdersModule`, `NotificationsModule`

### 3.3 Veritabanı Katmanı
- [ ] Supabase'in Postgres'ini korumaya devam edebilirsin (sadece client
      tarafını değiştiriyorsun) YA DA kendi Postgres instance'ına geçebilirsin
      — ilk seçenek migrasyonu kolaylaştırır
- [ ] **Prisma** ORM kurulumu (NestJS ile çok iyi çalışıyor), mevcut şemayı
      `prisma db pull` ile mevcut Supabase DB'den çek
- [ ] RLS policy'lerinin mantığını, artık NestJS tarafında **Guard**'lar ve
      **middleware**'ler olarak yeniden yaz (bu, "neden RLS'den authorization
      middleware'e geçtim" diye mülakatta anlatabileceğin iyi bir konu)

### 3.4 Auth'u Yeniden Yazma (En Kritik Kısım)
- [ ] JWT tabanlı auth: access token + refresh token stratejisi
- [ ] Password hashing (bcrypt/argon2)
- [ ] `@nestjs/passport` ile auth stratejisi kurulumu
- [ ] Refresh token rotation ve güvenli cookie yönetimi (httpOnly, secure)
- [ ] Rol bazlı guard'lar (`@Roles('admin')` gibi decorator'lar ile RBAC)

### 3.5 API Endpoint'lerini Yazma
- [ ] Her modül için CRUD endpoint'leri (products, quote-requests, orders)
- [ ] Kademeli fiyat hesaplama mantığını backend'e taşı (frontend'de
      tekrar yazmak yerine, tek doğruluk kaynağı backend olsun — gerçek
      sistemlerde fiyat hesaplaması asla client'a güvenilmez)
- [ ] Input validasyonu: `class-validator` + DTO'lar (zod'un NestJS
      karşılığı gibi düşünebilirsin)
- [ ] Swagger/OpenAPI dokümantasyonu otomatik oluşturulsun
      (`@nestjs/swagger`) — bu, API'nin profesyonel göründüğünün somut kanıtı

### 3.6 Realtime'ı Yeniden Kurma
- [ ] Supabase Realtime yerine **Socket.io** veya **Server-Sent Events (SSE)**
      ile bildirim sistemi
- [ ] NestJS'in `@WebSocketGateway` decorator'ı ile WebSocket gateway kurulumu

### 3.7 Frontend'i Yeni Backend'e Bağlama
- [ ] Next.js tarafındaki Supabase client çağrılarını, yeni API'ye HTTP
      istekleri (fetch/axios) ile değiştir
- [ ] Auth state yönetimini güncelle (Supabase Auth session yerine kendi
      JWT/cookie mantığın)
- [ ] Bu geçişi **modül modül** yap (önce auth, sonra products, sonra
      orders...) — tek seferde her şeyi değiştirmeye çalışma, her modülden
      sonra Cypress testlerini çalıştır

### 3.8 Deploy
- [ ] Backend'i ayrı deploy et (Railway, Render, ya da Fly.io — Vercel
      NestJS için ideal değil çünkü uzun süreli process'ler gerektirebilir)
- [ ] CORS yapılandırması (frontend Vercel'de, backend başka yerde olacağı için)
- [ ] Environment variable yönetimi (iki ayrı deploy hedefi için)

**Not:** Bu faz bittiğinde mülakatta anlatacağın hikaye çok güçlü olacak:
"Başta hız için BaaS (Supabase) kullandım, sonra kendi backend'imi
NestJS ile sıfırdan yazarak auth, yetkilendirme ve iş mantığı üzerinde
tam kontrol kazandım" — bu, junior/mid seviye bir adayın nadiren gösterdiği
bir olgunluk işareti.

---

## FAZ 4 — AI Chatbot

**Tahmini süre:** 1-3 hafta (yaklaşıma göre değişir — aşağıda iki seçenek var)
**Risk:** Orta-Yüksek (kapsam net değilse süre kontrolden çıkabilir)

### 4.1 Kapsam Kararı (Önce Bunu Netleştir)

**Seçenek A — RAG tabanlı chatbot (ÖNERİLEN, gerçekçi):**
Kendi ürün/sipariş verinle konuşabilen bir chatbot. Model eğitmiyorsun,
mevcut bir LLM'i (OpenAI API, Anthropic API, ya da açık kaynak bir model)
kendi verinle "besliyorsun". Örnek kullanım: alıcı "hangi tedarikçilerden
paketleme malzemesi alabilirim, en ucuzu hangisi" diye sorduğunda chatbot
gerçek ürün verinden yanıt üretiyor.

**Seçenek B — Fine-tuning (daha zor, daha spekülatif):**
Açık kaynak küçük bir modeli (örn. Llama 3.2 1B/3B gibi küçük bir model)
kendi domain verinle (B2B terminolojisi, ürün kategorileri) fine-tune
etmek. Bu, gerçek bir "model eğittim" hikayesi verir ama GPU erişimi
(Colab/RunPod gibi ücretli/ücretsiz kaynaklar), veri hazırlama, ve
değerlendirme süreçleri gerektirir — süre tahmini çok daha belirsiz.

> Tavsiyem: Seçenek A ile başla, çalışan bir MVP'n olsun. Zaman/ilgi
> kalırsa Seçenek B'yi "ileride eklenecek" olarak README'de belirt.

### 4.2 Seçenek A — RAG Chatbot Uygulama Adımları
- [ ] Bir LLM API'si seç (maliyet ve entegrasyon kolaylığı için Anthropic
      Claude API ya da OpenAI API)
- [ ] Ürün/şirket verini embedding'e çevir — bir vector database kur
      (Supabase'in `pgvector` extension'ı ya da Pinecone gibi ayrı bir servis)
- [ ] Kullanıcı sorusu geldiğinde: soruyu embed et → en alakalı ürün/sipariş
      kayıtlarını vector search ile bul → bu bağlamı LLM'e prompt olarak ver
      → yanıtı kullanıcıya döndür
- [ ] Backend'de (NestJS, eğer Faz 3 bittiyse) bir `ChatModule` oluştur,
      streaming yanıt desteği ekle (kullanıcı yanıtın kelime kelime
      geldiğini görsün — bu UX'i çok iyileştirir)
- [ ] Frontend'de bir chat widget (sağ altta açılan bir sohbet penceresi)

### 4.3 Seçenek B — Fine-tuning Adımları (İleri Seviye, Opsiyonel)
- [ ] Küçük bir açık kaynak model seç (Llama 3.2 3B veya benzeri)
- [ ] Eğitim verisi hazırla: B2B ürün soruları + doğru yanıt çiftleri
      (en az birkaç yüz örnek, kaliteli olması nicelikten önemli)
- [ ] LoRA/QLoRA gibi parametre-verimli fine-tuning tekniklerini araştır
      (tam fine-tuning için gereken kaynak çok daha fazla)
- [ ] Google Colab (ücretsiz tier, sınırlı GPU) veya RunPod (ücretli, saatlik
      kiralama) üzerinde eğitim
- [ ] Eğitilen modeli bir inference endpoint'i olarak sun (Hugging Face
      Inference Endpoints veya kendi sunucunda)

### 4.4 Test ve Cilalama
- [ ] Chatbot'un yanlış/uydurma (hallucinate) yanıt verdiği durumları test et,
      "bilmiyorum" diyebilmesini sağla
- [ ] Chat geçmişinin kullanıcı oturumunda saklanması

**Not:** Chatbot mülakatlarda en çok ilgi çeken özellik olacak çünkü 2026'da
"AI entegrasyonu yaptım" demek güçlü bir sinyal. Ama RAG ile "gerçek veriyle
konuşan" bir chatbot yapman, "model eğittim ama aslında ne yaptığını tam
açıklayamıyorum" durumuna düşmekten çok daha savunulabilir bir pozisyon.

---

## Genel Zaman Çizelgesi (Özet)

| Faz | Süre | Bağımlılık |
|---|---|---|
| 1. i18next | 3-4 gün | Yok |
| 2. Cypress testleri | 4-5 gün | Yok (Faz 1 ile paralel de yürütülebilir) |
| 3. Backend migrasyonu | 2-4 hafta | Faz 2'nin bitmiş olması önerilir |
| 4. Chatbot (RAG) | 1-2 hafta | Faz 3 bitmiş olursa daha temiz entegre olur, ama bağımsız da yapılabilir |

**Toplam gerçekçi süre:** 5-8 hafta (özellikle Faz 3'ün büyüklüğü nedeniyle).
Bunu "2-3 haftada bitiririm" diye planlama — her fazın sonunda GitHub'da
ayrı bir branch/PR olarak commit'lemen, hem ilerlemeyi görmeni hem de
mülakatta "işte bu commit'lerde backend migrasyonunu nasıl yaptığımı
görebilirsin" diyebilmeni sağlar.
