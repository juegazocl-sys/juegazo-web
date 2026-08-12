import { getSupabaseAdmin } from "../../../lib/supabase-admin";

export async function POST(request) {
  try {
    const payload = await request.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email || null,
        event_commune: payload.event_commune,
        event_date: payload.event_date,
        start_time: payload.start_time || null,
        end_time: payload.end_time || null,
        notes: payload.notes || null,
        total_amount: Number(payload.total_amount || 0),
        source: payload.source || "web"
      })
      .select()
      .single();

    if (error) throw error;
    return Response.json({ ok: true, reservation: data }, { status: 201 });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 400 });
  }
}

