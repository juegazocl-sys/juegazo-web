import { newsPosts, SITE_URL } from "../lib/news";
import { fallbackGames } from "../lib/catalog";
import { getProductUrl } from "../lib/product-seo";

export default function sitemap() {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...fallbackGames.map((game) => ({
      url: getProductUrl(game),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.82
    })),
    ...newsPosts.map((post) => ({
      url: `${SITE_URL}/noticias/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.65
    }))
  ];
}
