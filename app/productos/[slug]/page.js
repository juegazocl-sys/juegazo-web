import Link from "next/link";
import { notFound } from "next/navigation";
import { fallbackGames, money } from "../../../lib/catalog";
import {
  getProductBody,
  getProductBySlug,
  getProductDescription,
  getProductJsonLd,
  getProductUrl
} from "../../../lib/product-seo";

export function generateStaticParams() {
  return fallbackGames.map((game) => ({ slug: game.slug }));
}

export function generateMetadata({ params }) {
  const game = getProductBySlug(params.slug);
  if (!game) return {};
  const title = `Arriendo ${game.name} para eventos | Juegazo`;
  const description = getProductDescription(game);
  const url = getProductUrl(game);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: game.image_url,
          alt: game.name
        }
      ]
    }
  };
}

export default function ProductoPage({ params }) {
  const game = getProductBySlug(params.slug);
  if (!game) notFound();

  const jsonLd = getProductJsonLd(game);
  const relatedGames = fallbackGames.filter((item) => item.slug !== game.slug).slice(0, 3);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="product-page">
        <Link className="back-link" href="/productos">Volver al catalogo</Link>
        <section className="product-hero-detail">
          <div className="product-copy-detail">
            <span className="tag">{game.tag}</span>
            <h1>Arriendo {game.name}</h1>
            <p className="article-excerpt">{getProductDescription(game)}</p>
            <div className="product-price-box">
              <span>Precio de arriendo</span>
              <strong>{money(game.price)}</strong>
            </div>
            <div className="product-cta-row">
              <Link className="primary-link" href={`/#packs?producto=${game.slug}`}>Reservar ahora</Link>
              <Link className="ghost-link" href="/#juegos">Ver mas juegos</Link>
            </div>
          </div>
          <div className="product-image-detail">
            <img src={game.image_url} alt={game.name} />
          </div>
        </section>

        <section className="product-facts" aria-label={`Caracteristicas de ${game.name}`}>
          <div>
            <span>Jugadores</span>
            <strong>{game.players}</strong>
          </div>
          <div>
            <span>Edad recomendada</span>
            <strong>{game.age_recommendation}</strong>
          </div>
          <div>
            <span>Medidas</span>
            <strong>{game.dimensions}</strong>
          </div>
        </section>

        <section className="product-content">
          <h2>Detalles del arriendo</h2>
          {getProductBody(game).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="product-content">
          <h2>Como reservar {game.name}</h2>
          <ol className="product-steps">
            <li>Elige este juego o un pack desde la landing de Juegazo.</li>
            <li>Confirma comuna, fecha, hora de inicio y hora de termino.</li>
            <li>Juegazo revisa disponibilidad y confirma la reserva por WhatsApp.</li>
          </ol>
          <p><Link href="/arriendo-juegos-rancagua-machali">Consulta el servicio de arriendo en Rancagua y Machalí</Link>.</p>
        </section>

        <section className="product-related">
          <h2>Tambien puedes combinarlo con</h2>
          <div className="related-grid">
            {relatedGames.map((item) => (
              <Link className="related-card" href={`/productos/${item.slug}`} key={item.slug}>
                <img src={item.image_url} alt={item.name} />
                <strong>{item.name}</strong>
                <span>{money(item.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
