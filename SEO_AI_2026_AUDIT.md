# Auditoria SEO y visibilidad en experiencias de IA — Juegazo

Fecha: 2026-08-19
Alcance implementado: `juegazo-migration`, identificado por el repositorio como la reconstruccion activa destinada a GitHub, Vercel y Supabase. Los HTML sueltos y `juegazo-vercel` se trataron como fuentes historicas; `jesunutri-sync` es otro negocio y queda fuera del alcance.

## 1. Resumen ejecutivo

Juegazo ya tenia una base SEO valiosa: arquitectura indexable por productos y noticias, canonicals en las paginas comerciales, sitemap, robots, datos estructurados de servicios y contenido HTML prerenderizado en las paginas de detalle. No se cambiaron URLs, slugs, precios ni afirmaciones comerciales.

La principal debilidad era de consolidacion: la entidad Juegazo solo estaba descrita en el schema de cada producto; faltaban navegacion global, contacto y cobertura visibles, `noindex` explicito para administracion, schema editorial y canonicals completos para el indice de noticias. El sitemap tambien declaraba cada ejecucion como una nueva modificacion de todas las paginas.

Se corrigieron esas brechas. El build produce 29 rutas, los productos y articulos son HTML estatico y la landing es SSR para consultar el catalogo activo. Esto mejora la comprension de entidad, el rastreo, la confianza y la capacidad de reutilizar fragmentos concretos en consultas complejas sin agregar supuestos ni “hacks” para IA.

Estado general tras los cambios: base tecnica buena, cobertura comercial media y autoridad original todavia baja. El siguiente salto no depende de mas markup, sino de publicar evidencia real: condiciones de instalacion, metodologia, fotos propias, preguntas reales, cobertura exacta y experiencia verificable.

## 2. Negocio detectado

### BUSINESS_SEO_PROFILE

- Entidad principal y marca: Juegazo.
- Categoria: arriendo local de juegos para celebraciones y eventos.
- Subcategorias: juegos de competencia, juegos de mesa, inflable, punteria, equilibrio y packs combinados.
- Productos/servicios: nueve juegos individuales, nueve packs, traslado e instalacion/coordinacion del arriendo.
- Audiencias: personas que organizan cumpleanos infantiles, eventos familiares y celebraciones con grupos de distintas edades.
- Problemas que resuelve: entretencion a domicilio, seleccion de juegos segun edad/espacio/invitados, rotacion de participantes y combinacion de packs.
- Territorio documentado: Rancagua, Machali y otras 17 comunas de la Region de O'Higgins incluidas en el catalogo de traslados.
- Intenciones comerciales: arrendar un juego, comparar alternativas, armar un pack, revisar precio/medidas/edad, calcular traslado y solicitar reserva.
- Intenciones informativas: como elegir juegos, cuantos combinar, que cabe en un espacio, que sirve por edad y como funciona la reserva.
- Temas principales: arriendo de juegos, juegos para cumpleanos, packs para eventos, juegos por edad y espacio.
- Temas secundarios: instalacion, supervision, conexion electrica, traslado, rotacion y coordinacion.
- Conversion principal: envio del formulario de reserva.
- Microconversiones: abrir detalle de producto, agregar juego/pack, avanzar al formulario y llamar/contactar por WhatsApp.
- Experiencia real potencial: frecuencia de arriendos, tiempos de instalacion, restricciones observadas, combinaciones mas solicitadas, incidentes evitables y preguntas de clientes.
- Fuentes originales potenciales: historial de reservas de Supabase, inventario real, fotos/videos de eventos, consultas de WhatsApp y experiencia de instalacion.

### REQUIRES_BUSINESS_INPUT

- Nombre legal o razon social responsable del servicio.
- Direccion o base operativa publicable; no se agrego `PostalAddress` al schema.
- Horarios de contacto y condiciones de cancelacion, lluvia, danos, supervision y energia.
- Lista de cobertura definitiva y criterio de disponibilidad fuera de ella.
- Perfiles sociales oficiales para `sameAs`.
- Antiguedad, equipo responsable y experiencia verificable.
- Confirmacion de que instalacion y retiro estan incluidos en todos los precios.
- Metodo real para determinar disponibilidad; el schema actual usa `InStock` segun la implementacion previa y debe validarse.
- Identidad de autores/revisores si se desea firma personal en contenidos.

## 3. SEO existente que se conservo

- URLs limpias y estables: `/productos/[slug]` y `/noticias/[slug]`.
- Un H1 claro por pagina analizada y jerarquia H2/H3 util.
- Metadata especifica en catalogo, productos y articulos.
- Canonicals en home, catalogo y detalles.
- `robots.txt` con sitemap y bloqueo de `/admin`.
- `sitemap.xml` con home, indices y detalles.
- `Service`, `Offer` y `BreadcrumbList` en productos.
- Precio, medidas, jugadores y edad como texto visible, no solo en JavaScript.
- Enlaces HTML hacia catalogo, productos, noticias y reserva.
- Formularios con `label` y tipos de campo apropiados.
- Prerender estatico de productos y noticias.
- Fallback local del catalogo si Supabase no responde.

## 4. Cambios realizados

### `app/layout.js`

- Consolido `LocalBusiness` y `WebSite` con identificadores persistentes.
- Agrego telefono ya respaldado por la landing historica.
- Completo Open Graph y Twitter base.
- Cambia el idioma a `es-CL`.
- Agrega navegacion global semantica y footer con entidad, servicio, territorio y contacto visibles.

### `app/page.js`

- Define metadata y canonical propios para la intencion principal de arriendo local.

### `app/admin/page.js`

- Declara `noindex`, `nofollow` y `noarchive`; el bloqueo de robots se conserva como capa adicional.

### `app/noticias/page.js`

- Agrega canonical y Open Graph especificos.

### `app/noticias/[slug]/page.js`

- Agrega `Article` y `BreadcrumbList` coherentes con el contenido visible.
- Identifica a Juegazo como responsable editorial sin inventar una persona.
- Agrega una nota visible de procedencia del contenido.

### `app/sitemap.js`

- Sustituye fechas variables de compilacion por una fecha de actualizacion respaldada por el contenido. Evita enviar una falsa senal de frescura en cada deploy.

### `app/components/ReservationClient.js`

- Reduce la precarga del video a metadata y agrega nombre accesible.
- Agrega explicacion visible del proceso, cobertura, traslado y contacto usando datos existentes.

### `app/styles.css`

- Estilos responsivos para navegacion, footer, bloque operativo y procedencia editorial.

## 5. Problemas y oportunidades priorizadas

| Prioridad | Problema / URL | Intencion | Impacto | Esfuerzo | Solucion | Riesgo | Requiere negocio |
|---|---|---|---|---|---|---|---|
| P0 resuelto | `/admin` podia emitir metadata indexable | Administracion | Alto | Bajo | `noindex`, `nofollow`, `noarchive` | Bajo | No |
| P0 | Produccion debe confirmar HTTP 200, canonical y sitemap en el dominio final | Rastreo | Alto | Bajo | Crawl posterior al deploy y Search Console | Bajo | Acceso al despliegue |
| P1 | Datos de entidad incompletos | Confianza local | Alto | Medio | Agregar razon social, direccion/base, horarios y perfiles verificados | Bajo | Si |
| P1 | Disponibilidad `InStock` no esta demostrada por pagina | Reserva | Alto | Bajo | Validar regla o usar disponibilidad mas precisa | Medio | Si |
| P1 | Paginas de producto comparten una estructura y texto breves | Arriendo por juego | Alto | Medio | Incorporar requisitos, instalacion, contenido incluido, restricciones y fotos reales por juego | Bajo | Si |
| P1 | Packs no tienen URLs indexables propias | Comparar/reservar pack | Alto | Medio | Crear detalles unicos solo para packs estables y con informacion diferenciada | Medio | Si |
| P1 | No existen politicas comerciales visibles | Confianza/decision | Alto | Medio | Publicar cancelacion, clima, seguridad, danos y privacidad validadas | Bajo | Si |
| P2 | Articulos son breves y mayormente genericos | Informacion | Medio | Medio | Enriquecer con experiencia, ejemplos y evidencia real | Bajo | Si |
| P2 | Imagenes remotas no declaran dimensiones en HTML | Rendimiento/CLS | Medio | Medio | Migrar a `next/image` con dimensiones verificadas o guardar originales optimizados | Bajo | Si, archivos fuente |
| P2 | Hero en video puede afectar LCP/datos moviles | UX/performance | Medio | Medio | Medir Web Vitals y usar poster/archivo optimizado | Bajo | Si, multimedia |
| P2 | Home es dinamica en cada solicitud | Rendimiento | Medio | Bajo | Considerar revalidacion corta si la disponibilidad no depende del render | Medio | Si |
| P2 | No hay medicion documentada de pasos del embudo | Conversion | Medio | Medio | Eventos `view_item`, `add_to_cart`, `begin_checkout`, `generate_lead` | Bajo | Acceso analitica |
| P3 | No hay herramienta para elegir pack | Consulta compleja | Medio | Alto | Selector por edad, invitados, espacio y presupuesto con reglas reales | Bajo | Si |
| P3 | No hay dataset propio de uso | Autoridad original | Medio | Alto | Estudio anonimo de reservas y combinaciones | Privacidad | Si |

## 6. TOPICAL_AUTHORITY_MAP

### Pilar: arriendo de juegos para eventos

- Cluster: juegos individuales
  - Pregunta: que incluye, cuanto cuesta y que espacio necesita cada juego
  - Pagina: `/productos/[slug]`
- Cluster: catalogo
  - Pregunta: que juegos estan disponibles y cuanto cuestan
  - Pagina: `/productos`
- Cluster: reserva local
  - Pregunta: como reservar, donde hay cobertura y cuanto cuesta el traslado
  - Pagina: `/`

### Pilar: elegir juegos para cumpleanos

- Cluster: edad e invitados
  - Pregunta: que juego conviene segun edad y tamano del grupo
  - Pagina actual: `/noticias/como-elegir-juegos-para-cumpleanos-infantiles`
- Cluster: espacio e instalacion
  - Pregunta: que cabe en casa, quincho, terraza o salon
  - Paginas actuales: articulo de Hockey/Ping Pong y productos
- Cluster: inflables
  - Pregunta: superficie, supervision, espacio y edad
  - Pagina actual: `/noticias/inflable-para-cumpleanos-que-considerar`

### Pilar: packs de juegos

- Cluster: combinaciones
  - Pregunta: cuantos juegos necesito y que combinaciones rotan mejor
  - Pagina actual: `/noticias/packs-promocionales-para-ahorrar-en-eventos`
- Cluster: comparacion
  - Pregunta: juego individual versus pack; pack compacto versus pack para grupo grande
  - Pagina propuesta: guia comparativa basada en reglas y precios reales

### Pilar: servicio en Region de O'Higgins

- Cluster: Rancagua y Machali
  - Pregunta: cobertura, traslado, espacios habituales y coordinacion
  - Pagina actual: articulo local y landing
- Cluster: comunas secundarias
  - Pregunta: valor de traslado y disponibilidad
  - Pagina objetivo: seccion unica de cobertura; no crear paginas clonadas por comuna.

## 7. SEARCH_INTENT_MAP

| URL | Intencion primaria | Intencion secundaria | Entidad | Cluster | Valor original actual |
|---|---|---|---|---|---|
| `/` | Reservar juegos para un evento local | Consultar packs, cobertura y traslado | Juegazo | Reserva local | HIGH: catalogo/precios/formulario propios |
| `/productos` | Explorar juegos en arriendo | Comparar precio, edad y medidas | Catalogo Juegazo | Juegos | HIGH: inventario propio |
| `/productos/[slug]` | Evaluar y reservar un juego concreto | Ver requisitos y alternativas | Servicio/juego | Producto | MEDIUM: datos propios, texto breve |
| `/noticias` | Explorar consejos | Descubrir productos | Juegazo | Editorial | LOW: indice descriptivo |
| Articulo “como elegir” | Elegir por edad, espacio e invitados | Combinar juegos | Juegazo | Decision | MEDIUM |
| Articulos de producto | Entender usos de un juego | Llegar a reserva | Juego | Uso | LOW-MEDIUM |
| Articulo local | Encontrar juegos en Rancagua/Machali | Elegir por espacio | Juegazo | Local | MEDIUM |
| Articulo reserva | Entender el proceso sin abono | Iniciar solicitud | Reserva Juegazo | Conversion | HIGH: proceso propio |
| `/admin` | Gestion interna | Ninguna publica | Juegazo | No indexable | N/A |

No se detecto canibalizacion critica. Los articulos de producto se solapan parcialmente con las fichas, pero hoy cumplen una intencion editorial frente a una transaccional. Deben diferenciarse con experiencia y comparaciones; no se recomienda consolidar ni redirigir sin datos de Search Console.

## 8. AI_SEARCH_GAP_ANALYSIS

Las consultas complejas probables combinan edad, numero de invitados, espacio, comuna, presupuesto, instalacion y clima. El sitio cubre partes de ellas, pero no siempre explica restricciones ni criterios con suficiente precision para responder subpreguntas.

- P0: validar en produccion que Googlebot recibe contenido, 200, canonicals y JSON-LD sin depender de interaccion.
- P1: publicar condiciones reales por juego: interior/exterior, energia, superficie, tiempo de instalacion, supervision y contenido del arriendo.
- P1: explicar reglas reales de packs, exclusiones y por que ciertas combinaciones funcionan para determinados grupos.
- P1: fortalecer la entidad con informacion responsable y politicas verificables.
- P2: convertir preguntas reales de clientes en respuestas breves enlazadas a fichas comerciales.
- P2: comparar opciones con tablas propias, no con reescrituras generales.
- P3: calculadora/selector que produzca una recomendacion explicable desde reglas del negocio.

No se agrego `llms.txt`, schema inventado, texto oculto ni paginas destinadas solo a motores generativos.

## 9. CONTENT OPPORTUNITY BACKLOG

| Query / pregunta | Intencion | Funnel | Cluster | Target | Tipo | Valor negocio | Original disponible | Potencial IA | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| ¿Que juego cabe en mi espacio? | Decision | Medio | Instalacion | Fichas existentes | Existente | Alto | Medidas si; requisitos faltan | Alto | P1 |
| ¿Que incluye el arriendo de cada juego? | Comercial | Bajo | Producto | Fichas existentes | Existente | Alto | Requiere validacion | Alto | P1 |
| ¿Que pack conviene segun invitados y edad? | Decision | Medio | Packs | Guia + landing | Nuevo | Alto | Reservas/reglas | Alto | P1 |
| Juego individual vs pack | Comparacion | Medio | Packs | Guia comparativa | Nuevo | Alto | Precios propios | Alto | P1 |
| Juegos para casa, quincho o salon | Decision | Medio | Espacio | Articulo existente relacionado | Existente | Medio | Experiencia faltante | Alto | P2 |
| ¿Cuanto cuesta el traslado a mi comuna? | Comercial local | Bajo | Cobertura | Landing | Existente | Alto | Tabla propia | Medio | P1 |
| ¿Que pasa si llueve? | Riesgo | Bajo | Politicas | Pagina de condiciones | Nuevo | Alto | Falta politica | Alto | P1 |
| Checklist antes de instalar un inflable | Uso | Bajo | Seguridad | Articulo existente | Existente | Alto | Experiencia faltante | Alto | P1 |
| Errores al elegir juegos para muchos invitados | Informativa | Alto | Decision | Guia | Nuevo | Medio | Historial/experiencia | Alto | P2 |
| Combinaciones mas reservadas por tamano de grupo | Comparacion | Medio | Datos propios | Estudio | Nuevo | Alto | Base disponible, analizar privacidad | Alto | P3 |

Antes de publicar cada pagina nueva se debe comprobar que incorpora evidencia, reglas o datos que no obtendria el usuario de una respuesta generica de IA.

## 10. ORIGINAL_DATA_OPPORTUNITIES

- Analizar reservas anonimizadas: juegos/packs mas solicitados, combinaciones y estacionalidad.
- Registrar cantidad de invitados, tipo de espacio y resultado de la recomendacion con consentimiento adecuado.
- Documentar tiempo real de montaje y requisitos por juego.
- Fotografiar cada juego instalado en distintos tipos de espacio con autorizacion.
- Recopilar preguntas recurrentes de WhatsApp y respuestas aprobadas.
- Crear matriz real: juego × edad × jugadores simultaneos × espacio × energia × superficie.
- Registrar causas reales de cambios/cancelaciones para una guia preventiva.
- Medir rotacion aproximada por juego con metodologia publicada.

No se deben publicar porcentajes, preferencias, testimonios o “mas arrendados” derivados de estos datos hasta realizar un analisis reproducible. La frase actual “Lo mas arrendado hoy” debe validarse con datos o reemplazarse por una formulacion no temporal.

## 11. Riesgos y cambios no ejecutados

- No se cambiaron slugs ni URLs indexables.
- No se eliminaron ni redirigieron articulos potencialmente solapados.
- No se crearon paginas por comuna; serian delgadas sin informacion local diferenciada.
- No se agregaron direccion, horario, razon social, redes, autores personales ni politicas por falta de respaldo.
- No se alteraron precios, edades, medidas ni cobertura.
- No se migro de Shopify CDN; hacerlo sin archivos fuente puede romper imagenes y perder calidad.
- No se convirtieron todas las imagenes a `next/image` porque faltan dimensiones verificadas.
- No se cambio `force-dynamic` de la home porque puede afectar la frescura del catalogo.
- No se modifico `InStock`; requiere confirmar como representa la disponibilidad real por fecha.
- No se implementaron eventos de analitica sin conocer la plataforma y consentimiento aplicables.

## 12. Proximas acciones por impacto/esfuerzo

1. Desplegar y verificar HTTP, canonicals, robots, sitemap y Rich Results en el dominio final.
2. Conectar Search Console, enviar sitemap y revisar indexacion por URL.
3. Obtener las respuestas de `REQUIRES_BUSINESS_INPUT` y completar entidad/politicas.
4. Validar disponibilidad schema y la afirmacion “mas arrendado hoy”.
5. Completar fichas con requisitos reales de instalacion, contenido incluido y fotos propias.
6. Implementar medicion del embudo: vista de producto → agregado → continuar → reserva recibida.
7. Medir LCP, CLS e INP en produccion; optimizar video e imagenes con datos reales.
8. Mejorar primero los articulos existentes con evidencia antes de crear contenido nuevo.
9. Crear una guia de packs basada en reglas reales y enlazarla desde productos/landing.
10. Analizar datos anonimizados solo con criterios de privacidad y metodologia documentada.

## 13. Validacion final

- `npm run check`: aprobado.
- `npm run build`: aprobado con Next.js 14.2.35.
- 29 rutas generadas.
- Productos y noticias: prerender estatico.
- Landing y admin: render dinamico esperado.
- `robots.txt` y `sitemap.xml`: generados por Next.js.
- Comprobacion HTTP local: home, catalogo, producto, noticias, articulo, robots, sitemap y admin responden 200.
- Canonicals: home, indices, productos y articulos cubiertos.
- JSON-LD: `LocalBusiness`, `WebSite`, `Service`, `Offer`, `Article` y `BreadcrumbList` usan datos visibles o previamente respaldados.
- No se agregaron afirmaciones, clientes, testimonios, estadisticas, certificaciones, ubicaciones o autores ficticios.
- Pendiente fuera del entorno local: crawl HTTP del despliegue, validacion Rich Results, pruebas mobile reales y Core Web Vitals de campo.
