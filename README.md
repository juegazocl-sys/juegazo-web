# Juegazo Migration

Proyecto nuevo para migrar desde Shopify a GitHub + Vercel + Supabase sin tocar el proyecto actual.

## Estado

- Fuente local analizada: `../Juegazo landing.txt` y `../juegazo-vercel/index.html`
- App destino preparada: Next.js + Supabase
- Base de datos preparada: `supabase/migrations/001_initial_schema.sql`
- Export Shopify pendiente: productos, clientes, ordenes, paginas, menus, descuentos, dominios y configuracion.

## Etapas

1. Auditar Shopify y completar `docs/shopify-audit.md`.
2. Crear repo nuevo en GitHub con esta carpeta.
3. Vincular repo nuevo en Vercel.
4. Aplicar migracion SQL en el proyecto Supabase existente.
5. Cargar catalogo/servicios desde `imports/shopify`.
6. Configurar variables de entorno en Vercel.
7. Ejecutar QA y redireccionar dominio cuando este todo probado.

## Comandos

```bash
npm install
npm run audit:local
npm run check
npm run dev
```

## Variables Vercel

Copiar `.env.example` a `.env.local` para desarrollo y configurar lo mismo en Vercel.

