# Auditoria Shopify

## Alcance local revisado

Archivos disponibles en el workspace:

- `Juegazo landing.txt`
- `juegazo-vercel/index.html`
- Variantes `pag*.html` y `54343423.html`
- Proyecto no relacionado detectado: `jesunutri-sync`

## Hallazgos locales Juegazo

### Catalogo detectado

| Servicio | Precio | Tipo |
|---|---:|---|
| Basket Pro | 35000 | Juego |
| Taca Taca | 30000 | Juego |
| Hockey | 35000 | Juego |
| Inflable | 55000 | Juego |
| Pistolas Nerf | 30000 | Juego |
| Subfutbol | 40000 | Juego |
| Pool JR | 25000 | Juego |
| Ping Pong JR | 20000 | Juego |
| Tetris Tumble XL | 40000 | Juego |

### Packs detectados

| Pack | Precio |
|---|---:|
| Basket + 2 juegos a eleccion | 69900 |
| Basket + 1 juego a eleccion | 54900 |
| Subfutbol + 1 juego a eleccion | 64900 |
| Inflable + 1 juego a eleccion | 79900 |
| Inflable + 2 juegos a eleccion | 94900 |
| Hockey + Ping Pong JR | 44900 |
| Pistolas Nerf + 1 juego a eleccion | 54900 |
| Pack Silver - 4 juegos a eleccion | 99900 |
| Pack Golden - 5 juegos a eleccion | 119900 |

### Comportamiento detectado

- Selector de packs y reserva manual.
- Carrito en `localStorage`.
- Paso de reserva reemplazable por API propia.
- Assets alojados actualmente en `cdn.shopify.com`.
- Cobertura por comuna y precio de traslado.

## Lo que falta auditar en la cuenta Shopify real

Para completar el analisis de la cuenta, exportar o revisar:

1. Productos y variantes.
2. Colecciones.
3. Clientes.
4. Ordenes historicas.
5. Codigos de descuento.
6. Paginas y blogs.
7. Navegacion y menus.
8. Dominios y DNS.
9. Metafields.
10. Apps instaladas.
11. Configuracion de checkout, pagos e impuestos.
12. Configuracion de envios/retiro/zonas.
13. Assets del theme.
14. Pixeles, analytics, Meta/Google/TikTok.
15. Correos/notificaciones.
16. Politicas legales.

## Riesgos

- Los assets siguen en CDN Shopify; antes de apagar Shopify hay que copiarlos a Supabase Storage, Vercel Blob, Cloudflare R2 o mantener Shopify activo solo como CDN temporal.
- Si hay ordenes historicas en Shopify, deben migrarse como reservas/imports para trazabilidad.
- Si el dominio esta en Shopify, hay que planificar DNS antes del cambio a Vercel.
- Si existen apps de email, analytics o pagos, hay que replicar integraciones.

## Resultado deseado

- GitHub: repo nuevo.
- Vercel: proyecto nuevo conectado al repo.
- Supabase: proyecto existente con schema + datos.
- Shopify: solo fuente de datos durante migracion; no tocar hasta QA final.

