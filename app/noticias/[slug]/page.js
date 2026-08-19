import Link from "next/link";
import { notFound } from "next/navigation";
import { fallbackGames } from "../../../lib/catalog";
import { formatNewsDate, getNewsPost, newsPosts, SITE_URL } from "../../../lib/news";

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = getNewsPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Juegazo`,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/noticias/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/noticias/${post.slug}`,
      type: "article"
    }
  };
}

export default function NoticiaPage({ params }) {
  const post = getNewsPost(params.slug);
  if (!post) notFound();

  const url = `${SITE_URL}/noticias/${post.slug}`;
  const relatedProducts = (post.relatedProductSlugs || [])
    .map((slug) => fallbackGames.find((game) => game.slug === slug))
    .filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        inLanguage: "es-CL",
        mainEntityOfPage: url,
        author: { "@id": `${SITE_URL}#business` },
        publisher: { "@id": `${SITE_URL}#business` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Noticias y consejos", item: `${SITE_URL}/noticias` },
          { "@type": "ListItem", position: 3, name: post.title, item: url }
        ]
      }
    ]
  };

  return (
    <main>
      <article className="article-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Link className="back-link" href="/noticias">Volver a noticias</Link>
        <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
        <h1>{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {relatedProducts.length ? (
          <section aria-labelledby="related-products-title">
            <h2 id="related-products-title">Juegos relacionados</h2>
            <p>Revisa precio, edad recomendada y medidas antes de solicitar la reserva.</p>
            <ul>
              {relatedProducts.map((game) => (
                <li key={game.slug}><Link href={`/productos/${game.slug}`}>{game.name}</Link></li>
              ))}
            </ul>
          </section>
        ) : null}
        <p className="article-byline">Publicado por Juegazo · Informacion comercial y operativa del servicio.</p>
        <Link className="primary-link article-cta" href="/#packs">Reservar juegos</Link>
      </article>
    </main>
  );
}
