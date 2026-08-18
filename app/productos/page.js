import Link from "next/link";
import { fallbackGames, money } from "../../lib/catalog";
import { getProductDescription, getProductUrl } from "../../lib/product-seo";
import { SITE_URL } from "../../lib/news";

export const metadata = {
  title: "Juegos en arriendo para eventos | Juegazo",
  description: "Catalogo de juegos en arriendo para cumpleanos y eventos: Basket Pro, Taca Taca, Hockey, Inflable, Tetris Tumble XL y mas.",
  alternates: {
    canonical: `${SITE_URL}/productos`
  },
  openGraph: {
    title: "Juegos en arriendo para eventos | Juegazo",
    description: "Revisa cada juego disponible para arriendo y reserva online en Juegazo.",
    url: `${SITE_URL}/productos`
  }
};

export default function ProductosPage() {
  return (
    <main>
      <section className="news-hero products-hero">
        <Link className="back-link" href="/">Volver a reservar</Link>
        <h1>Juegos en arriendo</h1>
        <p>Paginas individuales preparadas para buscadores, con precio, medidas, edad recomendada y reserva online.</p>
      </section>

      <section className="product-list-grid" aria-label="Catalogo de juegos">
        {fallbackGames.map((game) => (
          <article className="product-list-card" key={game.slug}>
            <img src={game.image_url} alt={game.name} />
            <div>
              <span className="tag">{game.tag}</span>
              <h2>{game.name}</h2>
              <p>{getProductDescription(game)}</p>
              <div className="product-card-actions">
                <strong>{money(game.price)}</strong>
                <Link className="primary-link" href={`/productos/${game.slug}`}>Ver detalle</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
