# Plan de migracion

## Fase 0 - Congelar alcance

- No tocar `juegazo-vercel`.
- No cambiar DNS.
- No cerrar Shopify.
- Crear proyecto GitHub/Vercel nuevos.
- Usar Supabase existente.

## Fase 1 - Export Shopify

Archivos esperados en `imports/shopify`:

- `products.csv`
- `customers.csv`
- `orders.csv`
- `discounts.csv`
- `pages.json` o HTML exportado
- `navigation.json`
- `theme-assets.json`
- `metafields.json`

## Fase 2 - Supabase

- Ejecutar `supabase/migrations/001_initial_schema.sql`.
- Importar catalogo y comunas.
- Importar clientes/ordenes si existen.
- Revisar politicas RLS.

## Fase 3 - App nueva

- Conectar app a Supabase.
- Rehacer landing y flujo de reserva sobre tablas.
- Agregar panel admin.
- Agregar export CSV.

## Fase 4 - GitHub

- Crear repo nuevo.
- Subir carpeta `juegazo-migration`.
- Mantener rama `main`.

## Fase 5 - Vercel

- Crear proyecto nuevo desde GitHub.
- Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SITE_URL`
- Deploy preview.

## Fase 6 - QA

- Catalogo y precios.
- Packs.
- Comuna/traslado.
- Formulario de reserva.
- Escritura en Supabase.
- Mobile.
- SEO basico.
- Analytics.

## Fase 7 - Dominio

- Identificar proveedor DNS.
- Apuntar dominio a Vercel.
- Mantener Shopify en pausa hasta confirmar conversion.

