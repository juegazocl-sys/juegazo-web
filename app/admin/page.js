import { getSupabaseServer } from "../../lib/supabase-server";
import { money } from "../../lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administracion | Juegazo",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false, noarchive: true }
};

export default async function AdminPage({ searchParams }) {
  const token = searchParams?.token;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || token !== adminToken) {
    return (
      <main>
        <section className="panel">
          <h1>Admin Juegazo</h1>
          <p>Agrega <code>?token=ADMIN_TOKEN</code> para ver reservas.</p>
        </section>
      </main>
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <main>
        <section className="panel">
          <h1>Reservas Juegazo</h1>
          <p>El admin propio requiere configurar <code>SUPABASE_SERVICE_ROLE_KEY</code>. Mientras tanto, revisa reservas en Supabase.</p>
        </section>
      </main>
    );
  }

  const supabase = getSupabaseServer();
  const { data: reservations, error } = await supabase
    .from("juegazo_reservations")
    .select("*, juegazo_reservation_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main>
        <section className="panel">
          <h1>Reservas</h1>
          <p>{error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="panel">
        <p className="eyebrow">Admin</p>
        <h1>Reservas Juegazo</h1>
        <div className="admin-list">
          {(reservations || []).map((reservation) => (
            <article className="admin-card" key={reservation.id}>
              <div>
                <h3>{reservation.customer_name}</h3>
                <p>{reservation.customer_phone} Â· {reservation.customer_email || "sin email"}</p>
                <p>{reservation.raw_payload?.event_type || "evento por definir"} Â· {reservation.raw_payload?.children_count === "" || reservation.raw_payload?.children_count == null ? "sin dato" : reservation.raw_payload.children_count} ninos</p>
                <p>{reservation.raw_payload?.event_region || "region por definir"} Â· {reservation.event_commune} Â· {reservation.event_date} Â· {reservation.start_time || "hora por definir"}</p>
                <p>{(reservation.reservation_items || []).map((item) => item.name).join(" + ")}</p>
              </div>
              <strong>{money(reservation.total_amount)}</strong>
            </article>
          ))}
          {!reservations?.length ? <p>No hay reservas todavia.</p> : null}
        </div>
      </section>
    </main>
  );
}

