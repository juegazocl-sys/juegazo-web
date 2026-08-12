import ReservationClient from "./components/ReservationClient";
import { getCatalog } from "../lib/catalog-source";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getCatalog();
  return (
    <main>
      <ReservationClient {...catalog} />
    </main>
  );
}
