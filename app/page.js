import ReservationClient from "./components/ReservationClient";
import { getCatalog } from "../lib/catalog-source";
import { SITE_URL } from "../lib/news";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arriendo de juegos para cumpleaños en Rancagua | Juegazo",
  description: "Arrienda juegos, Taca Taca e inflables para cumpleaños y eventos en Rancagua, Machalí y O'Higgins. Revisa precios y reserva online.",
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
