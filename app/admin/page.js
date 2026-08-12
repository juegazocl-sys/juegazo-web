import { getSupabaseAdmin } from "../../lib/supabase-admin";
import { money } from "../../lib/catalog";

export const dynamic = "force-dynamic";

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

  const supabase = getSupabaseAdmin();
  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*, reservation_items(*)")
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
                <p>{reservation.customer_phone} · {reservation.customer_email || "sin email"}</p>
                <p>{reservation.event_commune} · {reservation.event_date} · {reservation.start_time || "hora por definir"}</p>
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

