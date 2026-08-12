"use client";

import { useMemo, useState } from "react";
import { money } from "../../lib/catalog";

function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

export default function ReservationClient({ games, packs, serviceAreas, source }) {
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    event_commune: serviceAreas[0]?.commune || "Rancagua",
    event_date: "",
    start_time: "",
    end_time: "",
    notes: ""
  });

  const gameMap = useMemo(() => Object.fromEntries(games.map((game) => [game.slug, game])), [games]);
  const serviceArea = serviceAreas.find((area) => area.commune === form.event_commune);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const transfer = Number(serviceArea?.transfer_price || 0);
  const total = subtotal + transfer;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function addGame(game) {
    setCart((current) => [
      ...current,
      {
        type: "game",
        slug: game.slug,
        name: game.name,
        price: game.price,
        items: [game.slug]
      }
    ]);
  }

  function defaultPackItems(pack) {
    if (pack.slug === "hockey-ping-pong") return ["hockey", "pingpong"];
    const selected = [];
    if (pack.base_game_slug) selected.push(pack.base_game_slug);
    const needed = Number(pack.picks_count || 0);
    const extras = games
      .map((game) => game.slug)
      .filter((slug) => slug !== "inflable" && !selected.includes(slug))
      .slice(0, needed);
    return uniq([...selected, ...extras]);
  }

  function addPack(pack) {
    setCart((current) => [
      ...current,
      {
        type: "pack",
        slug: pack.slug,
        name: pack.name,
        price: pack.price,
        items: defaultPackItems(pack)
      }
    ]);
  }

  function removeItem(index) {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function submitReservation(event) {
    event.preventDefault();
    if (!cart.length) {
      setStatus("Agrega al menos un juego o pack.");
      return;
    }

    setSending(true);
    setStatus("Enviando reserva...");

    const payload = {
      ...form,
      subtotal_amount: subtotal,
      transfer_amount: transfer,
      total_amount: total,
      source: "web",
      items: cart
    };

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo crear la reserva");
      setCart([]);
      setStatus("Reserva recibida. Te contactaremos por WhatsApp.");
      setForm((current) => ({ ...current, customer_name: "", customer_phone: "", customer_email: "", notes: "" }));
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Arriendo de juegos para eventos</p>
          <h1>Diversion a domicilio con reserva rapida</h1>
          <p className="lead">Elige juegos o packs, confirma datos del evento y dejamos la reserva en Supabase.</p>
          <a className="primary-link" href="#reservar">Reservar ahora</a>
        </div>
        <div className="hero-media">
          <video
            src="https://cdn.shopify.com/videos/c/o/v/3ad237893d6545c490a15250cc911208.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </section>

      <section className="section" id="packs">
        <div className="section-head">
          <p className="eyebrow">Packs</p>
          <h2>Packs recomendados</h2>
        </div>
        <div className="pack-grid">
          {packs.map((pack) => (
            <article className="pack-card" key={pack.slug}>
              <span className="tag">{pack.tag}</span>
              <h3>{pack.name}</h3>
              <strong>{money(pack.price)}</strong>
              <button type="button" onClick={() => addPack(pack)}>Agregar pack</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="juegos">
        <div className="section-head">
          <p className="eyebrow">Catalogo</p>
          <h2>Juegos disponibles</h2>
        </div>
        <div className="game-grid">
          {games.map((game) => (
            <article className="game-card" key={game.slug}>
              <img src={game.image_url} alt={game.name} />
              <div>
                <span className="tag">{game.tag}</span>
                <h3>{game.name}</h3>
                <p>{game.players} · Edad {game.age_recommendation}</p>
                <p>{game.dimensions}</p>
                <div className="card-bottom">
                  <strong>{money(game.price)}</strong>
                  <button type="button" onClick={() => addGame(game)}>Agregar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reserve-layout" id="reservar">
        <div className="cart panel">
          <p className="eyebrow">Tu seleccion</p>
          <h2>Reserva</h2>
          {cart.length ? (
            <div className="cart-list">
              {cart.map((item, index) => (
                <div className="cart-item" key={`${item.slug}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.items.map((slug) => gameMap[slug]?.name || slug).join(" + ")}</span>
                  </div>
                  <div>
                    <strong>{money(item.price)}</strong>
                    <button type="button" className="ghost" onClick={() => removeItem(index)}>Quitar</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aun no agregas juegos.</p>
          )}
          <div className="totals">
            <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div><span>Traslado</span><strong>{money(transfer)}</strong></div>
            <div><span>Total</span><strong>{money(total)}</strong></div>
          </div>
          <small>Datos cargados desde: {source === "supabase" ? "Supabase" : "catalogo local"}</small>
        </div>

        <form className="panel form" onSubmit={submitReservation}>
          <p className="eyebrow">Datos del evento</p>
          <h2>Confirmar reserva</h2>
          <label>
            Nombre
            <input required value={form.customer_name} onChange={(event) => updateField("customer_name", event.target.value)} />
          </label>
          <label>
            WhatsApp
            <input required value={form.customer_phone} onChange={(event) => updateField("customer_phone", event.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={form.customer_email} onChange={(event) => updateField("customer_email", event.target.value)} />
          </label>
          <label>
            Comuna
            <select value={form.event_commune} onChange={(event) => updateField("event_commune", event.target.value)}>
              {serviceAreas.map((area) => (
                <option key={area.commune} value={area.commune}>
                  {area.commune} - traslado {money(area.transfer_price)}
                </option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Fecha
              <input required type="date" value={form.event_date} onChange={(event) => updateField("event_date", event.target.value)} />
            </label>
            <label>
              Inicio
              <input type="time" value={form.start_time} onChange={(event) => updateField("start_time", event.target.value)} />
            </label>
            <label>
              Termino
              <input type="time" value={form.end_time} onChange={(event) => updateField("end_time", event.target.value)} />
            </label>
          </div>
          <label>
            Notas
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </label>
          <button type="submit" disabled={sending}>{sending ? "Enviando..." : "Enviar reserva"}</button>
          {status ? <p className="status">{status}</p> : null}
        </form>
      </section>
    </>
  );
}

