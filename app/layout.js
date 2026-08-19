import "./styles.css";
import { SITE_URL } from "../lib/news";

const logoUrl = "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/Diseno_sin_titulo_4.png?v=1773529966";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Juegazo | Arriendo de juegos para cumpleanos y eventos",
    template: "%s"
  },
  description: "Reserva online juegos en arriendo para cumpleanos, fiestas privadas y eventos.",
  alternates: {
    canonical: SITE_URL
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined
  },
  openGraph: {
    title: "Juegazo | Arriendo de juegos para cumpleanos y eventos",
    description: "Reserva online juegos en arriendo para cumpleanos, fiestas privadas y eventos.",
    url: SITE_URL,
    siteName: "Juegazo",
    type: "website",
    locale: "es_CL",
    images: [{ url: logoUrl, alt: "Juegazo" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Juegazo | Arriendo de juegos para eventos",
    description: "Juegos y packs con reserva online para cumpleanos, fiestas privadas y eventos.",
    images: [logoUrl]
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#business`,
      name: "Juegazo",
      url: SITE_URL,
      logo: logoUrl,
      image: logoUrl,
      telephone: "+56989010309",
      description: "Arriendo de juegos para cumpleanos y eventos con reserva online.",
      areaServed: ["Región de O'Higgins", "Región Metropolitana"]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Juegazo",
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE_URL}#business` }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <footer className="site-footer" id="contacto">
          <div>
            <strong>Juegazo</strong>
            <p>Juegos y packs para cumpleanos, fiestas privadas y eventos.</p>
          </div>
          <div>
            <strong>Contacto</strong>
            <a href="tel:+56989010309">WhatsApp: +56 9 8901 0309</a>
            <a href="/productos">Catalogo de juegos</a>
          </div>
          <nav className="footer-nav" aria-label="Navegacion principal">
            <a href="/productos">Juegos</a>
            <a href="/#packs">Packs</a>
            <a href="/noticias">Noticias</a>
            <a href="/#contacto">Contacto</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
