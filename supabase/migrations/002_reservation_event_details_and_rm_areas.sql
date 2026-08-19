alter table public.juegazo_service_areas
  add column if not exists region text not null default 'Región de O''Higgins';

alter table public.juegazo_reservations
  add column if not exists event_region text not null default 'Región de O''Higgins',
  add column if not exists event_type text,
  add column if not exists children_count integer;

alter table public.juegazo_reservations
  drop constraint if exists juegazo_reservations_children_count_check;

alter table public.juegazo_reservations
  add constraint juegazo_reservations_children_count_check
  check (children_count is null or children_count >= 0);

insert into public.juegazo_service_areas (region, commune, transfer_price, sort_order)
values
  ('Región de O''Higgins', 'Rancagua', 0, 10),
  ('Región de O''Higgins', 'Machali', 3000, 20),
  ('Región de O''Higgins', 'Requinoa', 4000, 30),
  ('Región de O''Higgins', 'Lo Miranda', 5000, 40),
  ('Región de O''Higgins', 'Codegua', 4000, 50),
  ('Región de O''Higgins', 'Coinco', 7000, 60),
  ('Región de O''Higgins', 'Coltauco', 7000, 70),
  ('Región de O''Higgins', 'Donihue', 6000, 80),
  ('Región de O''Higgins', 'Graneros', 4000, 90),
  ('Región de O''Higgins', 'Las Cabras', 7000, 100),
  ('Región de O''Higgins', 'Malloa', 9000, 110),
  ('Región de O''Higgins', 'Mostazal', 7000, 120),
  ('Región de O''Higgins', 'Olivar', 6000, 130),
  ('Región de O''Higgins', 'Peumo', 9000, 140),
  ('Región de O''Higgins', 'Pichidegua', 10000, 150),
  ('Región de O''Higgins', 'Quinta de Tilcoco', 10000, 160),
  ('Región de O''Higgins', 'Rengo', 10000, 170),
  ('Región de O''Higgins', 'San Vicente', 10000, 180),
  ('Región de O''Higgins', 'Coya', 10000, 190),
  ('Región Metropolitana', 'Providencia', 5000, 200),
  ('Región Metropolitana', 'Nunoa', 5000, 210),
  ('Región Metropolitana', 'Penalolen', 5000, 220),
  ('Región Metropolitana', 'La Reina', 5000, 230),
  ('Región Metropolitana', 'Las Condes', 5000, 240),
  ('Región Metropolitana', 'Vitacura', 5000, 250),
  ('Región Metropolitana', 'Lo Barnechea', 5000, 260),
  ('Región Metropolitana', 'La Dehesa', 5000, 270)
on conflict (commune) do update set
  region = excluded.region,
  transfer_price = excluded.transfer_price,
  sort_order = excluded.sort_order;
