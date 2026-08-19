const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scheduled = JSON.parse(fs.readFileSync(path.join(root, "lib/news-scheduled.json"), "utf8"));
const release = JSON.parse(fs.readFileSync(path.join(root, "lib/news-release.json"), "utf8"));
const catalogSource = fs.readFileSync(path.join(root, "lib/catalog.js"), "utf8");

if (scheduled.length !== 20) throw new Error(`Se esperaban 20 articulos y hay ${scheduled.length}`);

const slugs = new Set();
for (const [index, post] of scheduled.entries()) {
  for (const field of ["slug", "title", "date", "excerpt"]) {
    if (!post[field]) throw new Error(`Falta ${field} en articulo ${index + 1}`);
  }
  if (slugs.has(post.slug)) throw new Error(`Slug duplicado: ${post.slug}`);
  slugs.add(post.slug);
  if (!Array.isArray(post.body) || post.body.length < 4) throw new Error(`Contenido insuficiente: ${post.slug}`);
  const wordCount = post.body.join(" ").trim().split(/\s+/).length;
  if (wordCount < 100) throw new Error(`Articulo demasiado breve (${wordCount} palabras): ${post.slug}`);
  if (post.title.length > 70) throw new Error(`Titulo demasiado largo: ${post.slug}`);
  if (post.excerpt.length > 160) throw new Error(`Descripcion demasiado larga: ${post.slug}`);
  if (!Array.isArray(post.relatedProductSlugs) || post.relatedProductSlugs.length < 2) {
    throw new Error(`Faltan productos relacionados: ${post.slug}`);
  }
  for (const productSlug of post.relatedProductSlugs) {
    if (!catalogSource.includes(`slug: "${productSlug}"`)) {
      throw new Error(`Producto relacionado inexistente: ${productSlug} en ${post.slug}`);
    }
  }
  if (index > 0) {
    const previous = new Date(`${scheduled[index - 1].date}T12:00:00Z`);
    const current = new Date(`${post.date}T12:00:00Z`);
    const days = Math.round((current - previous) / 86400000);
    if (days !== 6) throw new Error(`Intervalo de ${days} dias antes de ${post.slug}`);
  }
}

const released = scheduled.filter((post) => post.date <= release.releasedThrough).length;
if (released !== release.releasedCount) {
  throw new Error(`news-release.json declara ${release.releasedCount}, pero corresponden ${released}`);
}

console.log(`calendario ok: ${scheduled.length} articulos, cada 6 dias`);
