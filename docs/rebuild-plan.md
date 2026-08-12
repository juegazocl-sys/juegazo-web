# Plan limpio sin Shopify

Shopify queda fuera porque la tienda no esta disponible. La reconstruccion usa:

- Catalogo local recuperado desde la landing.
- Supabase como base de datos principal.
- GitHub como repo nuevo.
- Vercel como hosting.
- Cloudflare/NIC.cl para DNS del dominio.

## Fuente recuperada

- 9 juegos.
- 9 packs.
- 19 comunas con costo de traslado.
- 14 assets remotos que todavia viven en CDN Shopify.

## Decisiones

- No tocar el proyecto anterior `juegazo-vercel`.
- Crear y publicar desde `juegazo-migration`.
- Cargar catalogo inicial con SQL.
- Mantener fallback local en la app para que la pagina pueda verse aunque Supabase aun no este configurado.
- Guardar reservas en tablas `customers`, `reservations` y `reservation_items`.

## Pendientes externos

- Confirmar proyecto Supabase exacto.
- Aplicar `supabase/migrations/001_initial_schema.sql`.
- Crear repo GitHub nuevo.
- Crear proyecto Vercel nuevo.
- Definir dominio exacto en Cloudflare/NIC.cl.
- Mover assets fuera de Shopify si Shopify deja de servir CDN.

