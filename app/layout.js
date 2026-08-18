import "./styles.css";
import { SITE_URL } from "../lib/news";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Juegazo | Arriendo de juegos para cumpleanos y eventos",
    template: "%s"
  },
  description: "Reserva online juegos en arriendo para cumpleanos y eventos en Rancagua, Machali y comunas cercanas.",
  alternates: {
    canonical: SITE_URL
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined
  },
  openGraph: {
    siteName: "Juegazo",
    type: "website",
    locale: "es_CL"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
