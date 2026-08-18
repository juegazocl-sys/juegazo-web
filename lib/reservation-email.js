import { money } from "./catalog";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatItems(items) {
  return items.map((item) => {
    const detail = Array.isArray(item.items) && item.items.length
      ? `<br><small>${escapeHtml(item.items.join(" + "))}</small>`
      : "";
    return `<li><strong>${escapeHtml(item.name)}</strong> - ${money(item.price)}${detail}</li>`;
  }).join("");
}

function buildReservationEmail(payload, reservationId) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const subject = `Nueva reserva Juegazo - ${payload.customer_name || "Cliente"} - ${payload.event_date || "sin fecha"}`;
  const whatsapp = String(payload.customer_phone || "").replace(/[^\d+]/g, "");
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/^\+/, "")}` : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#0f172a">
      <h1 style="color:#1188cf">Nueva reserva Juegazo</h1>
      <p>Se recibio una solicitud desde la web.</p>
      <h2>Cliente</h2>
      <p>
        <strong>Nombre:</strong> ${escapeHtml(payload.customer_name)}<br>
        <strong>WhatsApp:</strong> ${escapeHtml(payload.customer_phone)}
        ${whatsappLink ? `<br><a href="${escapeHtml(whatsappLink)}">Abrir WhatsApp</a>` : ""}<br>
        <strong>Email:</strong> ${escapeHtml(payload.customer_email || "sin email")}
      </p>
      <h2>Evento</h2>
      <p>
        <strong>Comuna:</strong> ${escapeHtml(payload.event_commune)}<br>
        <strong>Fecha:</strong> ${escapeHtml(payload.event_date)}<br>
        <strong>Inicio:</strong> ${escapeHtml(payload.start_time || "por definir")}<br>
        <strong>Termino:</strong> ${escapeHtml(payload.end_time || "por definir")}
      </p>
      <h2>Seleccion</h2>
      <ul>${formatItems(items)}</ul>
      <h2>Total</h2>
      <p>
        <strong>Subtotal:</strong> ${money(payload.subtotal_amount)}<br>
        <strong>Traslado:</strong> ${money(payload.transfer_amount)}<br>
        <strong>Total:</strong> ${money(payload.total_amount)}
      </p>
      <h2>Notas</h2>
      <p>${escapeHtml(payload.notes || "Sin notas")}</p>
      <hr>
      <p style="color:#5b6475;font-size:13px">ID reserva: ${escapeHtml(reservationId)}</p>
    </div>
  `;

  const text = [
    "Nueva reserva Juegazo",
    "",
    `Nombre: ${payload.customer_name || ""}`,
    `WhatsApp: ${payload.customer_phone || ""}`,
    `Email: ${payload.customer_email || "sin email"}`,
    `Comuna: ${payload.event_commune || ""}`,
    `Fecha: ${payload.event_date || ""}`,
    `Inicio: ${payload.start_time || "por definir"}`,
    `Termino: ${payload.end_time || "por definir"}`,
    "",
    "Seleccion:",
    ...items.map((item) => `- ${item.name}: ${money(item.price)} (${(item.items || []).join(" + ")})`),
    "",
    `Subtotal: ${money(payload.subtotal_amount)}`,
    `Traslado: ${money(payload.transfer_amount)}`,
    `Total: ${money(payload.total_amount)}`,
    "",
    `Notas: ${payload.notes || "Sin notas"}`,
    `ID reserva: ${reservationId}`
  ].join("\n");

  return { subject, html, text };
}

export async function sendReservationEmail(payload, reservationId) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVATION_EMAIL_TO;
  const from = process.env.EMAIL_FROM || "Juegazo <reservas@juegazo.cl>";

  if (!apiKey || !to) {
    return { skipped: true, reason: "missing_resend_env" };
  }

  const email = buildReservationEmail(payload, reservationId);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `juegazo-reservation-${reservationId}`
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((item) => item.trim()).filter(Boolean),
      subject: email.subject,
      html: email.html,
      text: email.text
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { skipped: false, ok: false, status: response.status, error: data?.message || "resend_error" };
  }

  return { skipped: false, ok: true, id: data?.id };
}
