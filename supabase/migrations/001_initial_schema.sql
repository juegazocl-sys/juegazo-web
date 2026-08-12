create extension if not exists pgcrypto;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tag text,
  description text,
  price integer not null check (price >= 0),
  age_recommendation text,
  players text,
  dimensions text,
  needs_power boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  shopify_product_id text,
  shopify_handle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_assets (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  url text not null,
  alt text,
  asset_type text not null default 'image' check (asset_type in ('image','video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tag text,
  price integer not null check (price >= 0),
  pack_type text not null default 'fixed' check (pack_type in ('fixed','base_plus_picks','picks_only')),
  base_game_slug text,
  picks_count integer not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  shopify_product_id text,
  shopify_handle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_games (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references public.packs(id) on delete cascade,
  game_id uuid references public.games(id) on delete cascade,
  role text not null default 'included' check (role in ('base','included','eligible')),
  sort_order integer not null default 0,
  unique(pack_id, game_id, role)
);

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  commune text unique not null,
  transfer_price integer not null default 0 check (transfer_price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  shopify_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  event_commune text not null,
  event_date date not null,
  start_time time,
  end_time time,
  notes text,
  subtotal_amount integer not null default 0,
  discount_amount integer not null default 0,
  transfer_amount integer not null default 0,
  total_amount integer not null default 0,
  status text not null default 'new' check (status in ('new','contacted','confirmed','cancelled','completed')),
  source text not null default 'web',
  shopify_order_id text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservation_items (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id) on delete cascade,
  game_id uuid references public.games(id),
  pack_id uuid references public.packs(id),
  name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price integer not null default 0,
  line_total integer not null default 0,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.shopify_imports (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null,
  resource_id text,
  handle text,
  payload jsonb not null,
  imported_at timestamptz not null default now(),
  unique(resource_type, resource_id)
);

create index if not exists games_active_sort_idx on public.games(active, sort_order, name);
create index if not exists packs_active_sort_idx on public.packs(active, sort_order, name);
create index if not exists reservations_event_date_idx on public.reservations(event_date);
create index if not exists reservations_status_idx on public.reservations(status);

alter table public.games enable row level security;
alter table public.game_assets enable row level security;
alter table public.packs enable row level security;
alter table public.pack_games enable row level security;
alter table public.service_areas enable row level security;
alter table public.customers enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_items enable row level security;
alter table public.shopify_imports enable row level security;

create policy "Public can read active games"
  on public.games for select
  using (active = true);

create policy "Public can read game assets"
  on public.game_assets for select
  using (true);

create policy "Public can read active packs"
  on public.packs for select
  using (active = true);

create policy "Public can read pack games"
  on public.pack_games for select
  using (true);

create policy "Public can read active service areas"
  on public.service_areas for select
  using (active = true);

insert into public.games (slug, name, tag, price, age_recommendation, players, dimensions, needs_power, sort_order)
values
  ('basket', 'Basket Pro', 'Mas pedido', 35000, '+6', 'Hasta 2 jugadores simultaneos', '210 x 205 x 65 cm', false, 10),
  ('taca', 'Taca Taca', 'Top ventas', 30000, '+4', 'Hasta 4 jugadores simultaneos', '120 x 60 x 65 cm', false, 20),
  ('hockey', 'Hockey', 'Muy pedido', 35000, '+6', 'Hasta 2 jugadores simultaneos', '152 x 78 x 80 cm', true, 30),
  ('inflable', 'Inflable', 'Cumpleanos', 55000, '4 a 8 anos', 'Hasta 3 jugadores simultaneos', '300 x 400 x 600 cm', false, 40),
  ('nerf', 'Pistolas Nerf', 'Punteria', 30000, '+2', 'Hasta 5 jugadores simultaneos', '150 x 150 x 120 cm', false, 50),
  ('subfutbol', 'Subfutbol', 'Mesa', 40000, '+5', 'Hasta 2 jugadores simultaneos', '210 x 70 x 100 cm', false, 60),
  ('pool', 'Pool JR', 'Ninos', 25000, '+6', 'Hasta 2 jugadores simultaneos', '120 x 60 x 65 cm', false, 70),
  ('pingpong', 'Ping Pong JR', 'Complemento', 20000, '+5', 'Hasta 2 jugadores simultaneos', '120 x 60 x 65 cm', false, 80),
  ('tetris', 'Tetris Tumble XL', 'Equilibrio', 40000, '+6', 'Sin limite de jugadores', '160 x 150 x 65 cm', false, 90)
on conflict (slug) do update set
  name = excluded.name,
  tag = excluded.tag,
  price = excluded.price,
  age_recommendation = excluded.age_recommendation,
  players = excluded.players,
  dimensions = excluded.dimensions,
  needs_power = excluded.needs_power,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.packs (slug, name, tag, price, pack_type, base_game_slug, picks_count, sort_order)
values
  ('basket-2-juegos', 'Basket + 2 juegos a eleccion', 'Promocion', 69900, 'base_plus_picks', 'basket', 2, 10),
  ('basket-1-juego', 'Basket + 1 juego a eleccion', 'Promocion', 54900, 'base_plus_picks', 'basket', 1, 20),
  ('subfutbol-1-juego', 'Subfutbol + 1 juego a eleccion', 'Catalogo', 64900, 'base_plus_picks', 'subfutbol', 1, 30),
  ('inflable-1-juego', 'Inflable + 1 juego a eleccion', 'Cumpleanos', 79900, 'base_plus_picks', 'inflable', 1, 40),
  ('inflable-2-juegos', 'Inflable + 2 juegos a eleccion', 'Mas completo', 94900, 'base_plus_picks', 'inflable', 2, 50),
  ('hockey-ping-pong', 'Hockey + Ping Pong JR', 'Express', 44900, 'fixed', null, 0, 60),
  ('nerf-1-juego', 'Pistolas Nerf + 1 juego a eleccion', 'Catalogo', 54900, 'base_plus_picks', 'nerf', 1, 70),
  ('silver', 'Pack Silver - 4 juegos a eleccion', 'Pack Silver', 99900, 'picks_only', null, 4, 80),
  ('golden', 'Pack Golden - 5 juegos a eleccion', 'Pack Golden', 119900, 'picks_only', null, 5, 90)
on conflict (slug) do update set
  name = excluded.name,
  tag = excluded.tag,
  price = excluded.price,
  pack_type = excluded.pack_type,
  base_game_slug = excluded.base_game_slug,
  picks_count = excluded.picks_count,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.service_areas (commune, transfer_price, sort_order)
values
  ('Rancagua', 0, 10),
  ('Machali', 3000, 20),
  ('Requinoa', 4000, 30),
  ('Lo Miranda', 5000, 40),
  ('Codegua', 4000, 50),
  ('Coinco', 7000, 60),
  ('Coltauco', 7000, 70),
  ('Donihue', 6000, 80),
  ('Graneros', 4000, 90),
  ('Las Cabras', 7000, 100),
  ('Malloa', 9000, 110),
  ('Mostazal', 7000, 120),
  ('Olivar', 6000, 130),
  ('Peumo', 9000, 140),
  ('Pichidegua', 10000, 150),
  ('Quinta de Tilcoco', 10000, 160),
  ('Rengo', 10000, 170),
  ('San Vicente', 10000, 180),
  ('Coya', 10000, 190)
on conflict (commune) do update set
  transfer_price = excluded.transfer_price,
  sort_order = excluded.sort_order;

