import ReservationClient from "./components/ReservationClient";
import { getCatalog } from "../lib/catalog-source";

export default async function HomePage() {
  const catalog = await getCatalog();
  return (
    <main>
      <ReservationClient {...catalog} />
    </main>
  );
}
