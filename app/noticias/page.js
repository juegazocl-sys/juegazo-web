import Link from "next/link";
import { newsPosts, SITE_URL } from "../../lib/news";

export const metadata = {
  title: "Noticias y consejos | Juegazo",
  description: "Consejos para elegir juegos de arriendo, combinar packs y preparar cumpleanos y eventos.",
  alternates: { canonical: `${SITE_URL}/noticias` },
  openGraph: {
    title: "Consejos para cumpleanos y eventos | Juegazo",
    description: "Guias para elegir juegos, combinar packs y preparar tu evento.",
    url: `${SITE_URL}/noticias`
  }
};

export default function NoticiasPage() {
  return (
    <main>
      <section className="news-hero">
        <Link className="back-link" href="/">Volver a reservar</Link>
        <h1>Noticias y consejos Juegazo</h1>
        <p>Ideas rapidas para elegir juegos, armar packs y preparar eventos con entretencion a domicilio.</p>
      </section>

      <section className="news-grid" aria-label="Noticias">
        {newsPosts.map((post) => (
          <article className="news-card" key={post.slug}>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("es-CL")}</time>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`/noticias/${post.slug}`}>Leer noticia</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
