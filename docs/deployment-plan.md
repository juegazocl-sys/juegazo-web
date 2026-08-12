# Etapas de despliegue

## 1. Supabase

1. Abrir SQL editor del proyecto Supabase existente.
2. Ejecutar `supabase/migrations/001_initial_schema.sql`.
3. Confirmar que existen:
   - `games`
   - `packs`
   - `service_areas`
   - `customers`
   - `reservations`
   - `reservation_items`
4. Copiar:
   - Project URL
   - anon key
   - service role key

## 2. GitHub

1. Crear repo nuevo para `juegazo-migration`.
2. Pushear rama `main`.
3. No subir `.env.local`.

## 3. Vercel

1. Crear proyecto nuevo desde GitHub.
2. Framework: Next.js.
3. Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_TOKEN`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy preview.

## 4. DNS

1. Anotar registros actuales.
2. En Vercel agregar dominio.
3. Configurar registros indicados por Vercel en Cloudflare o NIC.cl.
4. Mantener TTL bajo mientras propagamos.
5. Probar:
   - dominio raiz
   - `www`
   - SSL
   - reserva real en Supabase

