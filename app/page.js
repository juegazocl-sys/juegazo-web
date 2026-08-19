import ReservationClient from "./components/ReservationClient";
import { getCatalog } from "../lib/catalog-source";
import { SITE_URL } from "../lib/news";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arriendo de juegos para cumpleanos y eventos | Juegazo",
  description: "Arrienda juegos y packs para cumpleanos y eventos en Rancagua, Machali y comunas cercanas. Revisa precios y solicita tu reserva online.",
  alternates: { canonical: SITE_URL }
};

export default async function HomePage() {
  const catalog = await getCatalog();
  return (
    <main>
      <ReservationClient {...catalog} />
    </main>
  );
}
