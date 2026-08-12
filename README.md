# Juegazo Web

Proyecto nuevo para reconstruir Juegazo en GitHub + Vercel + Supabase sin depender de Shopify.

## Estado

- Fuente local analizada: `../Juegazo landing.txt` y `../juegazo-vercel/index.html`
- Web destino preparada: Next.js + Supabase
- Base de datos preparada: `supabase/migrations/001_initial_schema.sql`
- Shopify descartado como fuente activa.

## Etapas

1. Aplicar SQL en el proyecto Supabase existente.
2. Crear repo nuevo en GitHub con esta carpeta.
3. Vincular repo nuevo en Vercel.
4. Configurar variables de entorno en Vercel.
5. Ejecutar QA.
6. Cambiar DNS del dominio cuando Vercel entregue los registros.

## Comandos

```bash
npm install
npm run audit:local
npm run check
npm run dev
```

## Variables Vercel

Copiar `.env.example` a `.env.local` para desarrollo y configurar lo mismo en Vercel.
