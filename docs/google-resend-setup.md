# Setup Resend y Google Search

## Resend

1. Crear cuenta en Resend.
2. Agregar el dominio o subdominio recomendado por Resend.
3. Copiar los registros DNS que entrega Resend y pegarlos en Cloudflare.
4. Crear una API key.
5. En Vercel, agregar:
   - `RESEND_API_KEY`
   - `RESERVATION_EMAIL_TO`
   - `EMAIL_FROM`, por ejemplo `Juegazo <reservas@juegazo.cl>`
6. Hacer una reserva de prueba.

La reserva se guarda aunque Resend falle. El email es solo notificacion.

## Google Search Console

1. Agregar propiedad `https://juegazo.cl`.
2. Usar verificacion por meta tag o DNS.
3. Si usas meta tag, copiar solo el contenido del token y agregarlo en Vercel como:
   - `GOOGLE_SITE_VERIFICATION`
4. Re-desplegar y verificar en Search Console.
5. Enviar sitemap:
   - `https://juegazo.cl/sitemap.xml`

## SEO organico para juegos

Juegazo arrienda juegos, por lo que Google Merchant Center no es el canal correcto para esta etapa. Merchant esta orientado a venta de productos y puede rechazar servicios o arriendos.

URLs preparadas:

- Catalogo: `https://juegazo.cl/productos`
- Ejemplo producto: `https://juegazo.cl/productos/basket`

Cada pagina individual tiene contenido unico, imagen, precio de arriendo, datos visibles y marcado estructurado `Service` para ayudar a Google Search a entender que se trata de arriendo de juegos para eventos.
