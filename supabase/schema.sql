-- ================================================================
-- SupplyHub — Schema + Seed
-- Supabase Dashboard → SQL Editor → Yeni sorgu → Yapıştır → Çalıştır
-- ================================================================

-- ── 1. TABLOLAR ─────────────────────────────────────────────────

create table if not exists companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('seller', 'buyer')),
  created_at  timestamptz not null default now()
);

create table if not exists users (
  id          uuid primary key references auth.users(id) on delete cascade,
  company_id  uuid not null references companies(id) on delete cascade,
  email       text not null,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  name        text not null
);

create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  seller_id     uuid not null references companies(id) on delete cascade,
  name          text not null,
  description   text not null default '',
  category      text not null,
  min_order_qty integer not null default 1 check (min_order_qty >= 1),
  price_tiers   jsonb not null default '[]',
  image_url     text,
  status        text not null default 'draft' check (status in ('active', 'draft')),
  created_at    timestamptz not null default now()
);

create table if not exists quote_requests (
  id                    uuid primary key default gen_random_uuid(),
  buyer_id              uuid not null references companies(id) on delete cascade,
  product_id            uuid not null references products(id) on delete cascade,
  quantity              integer not null check (quantity > 0),
  buyer_note            text,
  status                text not null default 'pending'
                          check (status in ('pending', 'responded', 'accepted', 'declined')),
  seller_response_price numeric,
  seller_message        text,
  created_at            timestamptz not null default now()
);

create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  buyer_id      uuid not null references companies(id) on delete cascade,
  seller_id     uuid not null references companies(id) on delete cascade,
  status        text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'shipped', 'delivered')),
  total         numeric not null default 0 check (total >= 0),
  needs_approval boolean not null default false,
  approved_by   uuid references users(id),
  created_by    uuid not null references users(id),
  created_at    timestamptz not null default now()
);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  quantity    integer not null check (quantity > 0),
  unit_price  numeric not null check (unit_price >= 0)
);

-- ── 2. SEED DATA ─────────────────────────────────────────────────
-- Demo şifre: Demo1234!
-- Demo hesaplar: ali@freshfarm.com / ayse@gunespazar.com / fatma@gunespazar.com / kemal@lezzet.com

do $$
declare
  -- Şirketler
  c_seller  uuid := 'c0000001-0000-0000-0000-000000000001';
  c_buyer1  uuid := 'c0000002-0000-0000-0000-000000000002';
  c_buyer2  uuid := 'c0000003-0000-0000-0000-000000000003';

  -- Auth kullanıcıları (aynı UUID'ler public.users'ta da kullanılır)
  u_seller_admin uuid := 'u0000001-0000-0000-0000-000000000001';
  u_buyer1_admin uuid := 'u0000002-0000-0000-0000-000000000002';
  u_buyer1_staff uuid := 'u0000003-0000-0000-0000-000000000003';
  u_buyer2_admin uuid := 'u0000004-0000-0000-0000-000000000004';

  -- Ürünler
  p1 uuid := 'a0000001-0000-0000-0000-000000000001';
  p2 uuid := 'a0000002-0000-0000-0000-000000000002';
  p3 uuid := 'a0000003-0000-0000-0000-000000000003';
  p4 uuid := 'a0000004-0000-0000-0000-000000000004';

  -- Siparişler
  o1 uuid := 'b0000001-0000-0000-0000-000000000001';
  o2 uuid := 'b0000002-0000-0000-0000-000000000002';
  o3 uuid := 'b0000003-0000-0000-0000-000000000003';
  o4 uuid := 'b0000004-0000-0000-0000-000000000004';

begin

  -- Şirketler
  insert into companies (id, name, type) values
    (c_seller, 'FreshFarm Gıda A.Ş.', 'seller'),
    (c_buyer1, 'Güneş Market Zinciri', 'buyer'),
    (c_buyer2, 'Lezzet Restoran Grubu', 'buyer');

  -- Auth kullanıcıları (demo hesaplar, şifre: Demo1234!)
  insert into auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user
  ) values
    (
      '00000000-0000-0000-0000-000000000000',
      u_seller_admin, 'authenticated', 'authenticated', 'ali@freshfarm.com',
      crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('name','Ali Yılmaz','company_type','seller','role','admin','company_id',c_seller),
      false, false
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      u_buyer1_admin, 'authenticated', 'authenticated', 'ayse@gunespazar.com',
      crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('name','Ayşe Demir','company_type','buyer','role','admin','company_id',c_buyer1),
      false, false
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      u_buyer1_staff, 'authenticated', 'authenticated', 'fatma@gunespazar.com',
      crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('name','Fatma Çelik','company_type','buyer','role','staff','company_id',c_buyer1),
      false, false
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      u_buyer2_admin, 'authenticated', 'authenticated', 'kemal@lezzet.com',
      crypt('Demo1234!', gen_salt('bf')), now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('name','Kemal Arslan','company_type','buyer','role','admin','company_id',c_buyer2),
      false, false
    );

  -- Auth identities (e-posta girişinin çalışması için gerekli)
  insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values
    ('ali@freshfarm.com',    u_seller_admin, json_build_object('sub', u_seller_admin::text, 'email', 'ali@freshfarm.com'),    'email', now(), now(), now()),
    ('ayse@gunespazar.com',  u_buyer1_admin, json_build_object('sub', u_buyer1_admin::text, 'email', 'ayse@gunespazar.com'),  'email', now(), now(), now()),
    ('fatma@gunespazar.com', u_buyer1_staff, json_build_object('sub', u_buyer1_staff::text, 'email', 'fatma@gunespazar.com'), 'email', now(), now(), now()),
    ('kemal@lezzet.com',     u_buyer2_admin, json_build_object('sub', u_buyer2_admin::text, 'email', 'kemal@lezzet.com'),     'email', now(), now(), now());

  -- Public kullanıcı profilleri
  insert into users (id, company_id, email, role, name) values
    (u_seller_admin, c_seller, 'ali@freshfarm.com',    'admin', 'Ali Yılmaz'),
    (u_buyer1_admin, c_buyer1, 'ayse@gunespazar.com',  'admin', 'Ayşe Demir'),
    (u_buyer1_staff, c_buyer1, 'fatma@gunespazar.com', 'staff', 'Fatma Çelik'),
    (u_buyer2_admin, c_buyer2, 'kemal@lezzet.com',     'admin', 'Kemal Arslan');

  -- Ürünler
  insert into products (id, seller_id, name, description, category, min_order_qty, price_tiers, status) values
    (p1, c_seller, 'Organik Zeytinyağı (5L)',
      'Soğuk sıkım, sertifikalı organik zeytinyağı. Ege bölgesi.', 'Yağlar', 10,
      '[{"min_qty":10,"max_qty":49,"price":185},{"min_qty":50,"max_qty":199,"price":165},{"min_qty":200,"max_qty":null,"price":145}]',
      'active'),
    (p2, c_seller, 'Tam Buğday Unu (25kg)',
      'Değirmenden doğrudan, gluten oranı yüksek ekmeklik un.', 'Tahıllar', 20,
      '[{"min_qty":20,"max_qty":99,"price":42},{"min_qty":100,"max_qty":499,"price":38},{"min_qty":500,"max_qty":null,"price":34}]',
      'active'),
    (p3, c_seller, 'Doğal Bal (1kg)',
      'Karadeniz yayla balı, saf ve katkısız.', 'Doğal Ürünler', 12,
      '[{"min_qty":12,"max_qty":59,"price":220},{"min_qty":60,"max_qty":299,"price":195},{"min_qty":300,"max_qty":null,"price":175}]',
      'active'),
    (p4, c_seller, 'Taze Makarna (500g)',
      'Yumurtalı ev yapımı makarna, günlük üretim.', 'Baklagiller & Makarna', 24,
      '[{"min_qty":24,"max_qty":119,"price":28},{"min_qty":120,"max_qty":null,"price":24}]',
      'draft');

  -- Teklif talepleri
  insert into quote_requests (buyer_id, product_id, quantity, buyer_note, status, seller_response_price, seller_message, created_at)
  values
    (c_buyer1, p1, 300, 'Düzenli aylık sipariş için fiyat alıyoruz.', 'pending', null, null, now() - interval '2 days'),
    (c_buyer1, p2, 600, null, 'responded', 36, '600 adet için özel iskonto uygulandı.', now() - interval '5 days'),
    (c_buyer2, p3, 150, 'Restoran menüsü için kullanacağız.', 'accepted', 180, 'Anlaşma sağlandı, teşekkürler.', now() - interval '10 days'),
    (c_buyer2, p1, 50, null, 'declined', null, null, now() - interval '15 days');

  -- Siparişler
  insert into orders (id, buyer_id, seller_id, status, total, needs_approval, approved_by, created_by, created_at)
  values
    (o1, c_buyer1, c_seller, 'delivered', 16500,  false, null,          u_buyer1_staff, now() - interval '42 days'),
    (o2, c_buyer1, c_seller, 'shipped',   42000,  true,  u_buyer1_admin, u_buyer1_staff, now() - interval '27 days'),
    (o3, c_buyer2, c_seller, 'pending',   58000,  true,  null,          u_buyer2_admin, now() - interval '11 days'),
    (o4, c_buyer1, c_seller, 'confirmed', 8900,   false, null,          u_buyer1_staff, now() - interval '7 days');

  -- Sipariş kalemleri
  insert into order_items (order_id, product_id, quantity, unit_price) values
    (o1, p1, 100, 165),
    (o2, p2, 500, 38),
    (o2, p3, 100, 175),
    (o3, p2, 500, 34),
    (o3, p1, 200, 145),
    (o4, p3,  40, 220),
    (o4, p4,  10,  90);

end;
$$;
