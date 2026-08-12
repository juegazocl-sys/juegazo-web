import { getSupabaseAdmin } from "../../../lib/supabase-admin";

export async function POST(request) {
  try {
    const payload = await request.json();
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (!payload.customer_name) throw new Error("Falta el nombre");
    if (!payload.customer_phone) throw new Error("Falta el WhatsApp");
    if (!payload.event_commune) throw new Error("Falta la comuna");
    if (!payload.event_date) throw new Error("Falta la fecha");
    if (!items.length) throw new Error("Agrega al menos un juego o pack");

    const supabase = getSupabaseAdmin();
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        name: payload.customer_name,
        phone: payload.customer_phone,
        email: payload.customer_email || null
      })
      .select()
      .single();

    if (customerError) throw customerError;

    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert({
        customer_id: customer.id,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email || null,
        event_commune: payload.event_commune,
        event_date: payload.event_date,
        start_time: payload.start_time || null,
        end_time: payload.end_time || null,
        notes: payload.notes || null,
        subtotal_amount: Number(payload.subtotal_amount || 0),
        transfer_amount: Number(payload.transfer_amount || 0),
        total_amount: Number(payload.total_amount || 0),
        source: payload.source || "web",
        raw_payload: payload
      })
      .select()
      .single();

    if (error) throw error;

    const reservationItems = items.map((item) => ({
      reservation_id: reservation.id,
      name: item.name,
      quantity: 1,
      unit_price: Number(item.price || 0),
      line_total: Number(item.price || 0),
      raw_payload: item
    }));

    const { error: itemsError } = await supabase
      .from("reservation_items")
      .insert(reservationItems);

    if (itemsError) throw itemsError;

    return Response.json({ ok: true, reservation }, { status: 201 });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 400 });
  }
}
