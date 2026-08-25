-- ================================================================
-- SupplyHub — Tablo Şeması
-- Supabase Dashboard → SQL Editor → Yeni sorgu → Yapıştır → Çalıştır
-- Seed verisi : /api/seed endpoint'ini çağır (Login sayfasındaki buton)
-- ================================================================
-- github actions deneme
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
