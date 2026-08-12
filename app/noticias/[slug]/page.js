import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsPost, newsPosts, SITE_URL } from "../../../lib/news";

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

  return (
    <main>
      <article className="article-page">
        <Link className="back-link" href="/noticias">Volver a noticias</Link>
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("es-CL")}</time>
        <h1>{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link className="primary-link article-cta" href="/#packs">Reservar juegos</Link>
      </article>
    </main>
  );
}
