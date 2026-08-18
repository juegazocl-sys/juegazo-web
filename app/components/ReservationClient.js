"use client";

import { useMemo, useRef, useState } from "react";
import { money } from "../../lib/catalog";
import { newsPosts } from "../../lib/news";

function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

export default function ReservationClient({ games, packs, serviceAreas, source }) {
  const [cart, setCart] = useState([]);
  const [activePack, setActivePack] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState("select");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const packBuilderRef = useRef(null);
  const reserveRef = useRef(null);
  const formRef = useRef(null);
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
  const activePackItems = activePack ? uniq([
    activePack.pack.base_game_slug,
    ...activePack.picks
  ]) : [];
  const canAddActivePack = activePack
    ? activePack.picks.length === Number(activePack.pack.picks_count || 0)
      && activePack.picks.every(Boolean)
      && uniq(activePackItems).length === activePackItems.length
    : false;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function addGame(game) {
    setCheckoutStep("select");
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
    setTimeout(() => reserveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function fixedPackItems(pack) {
    if (pack.slug === "hockey-ping-pong") return ["hockey", "pingpong"];
    if (!Number(pack.picks_count || 0) && pack.base_game_slug) return [pack.base_game_slug];
    return [];
  }

  function eligiblePackGames(pack, pickIndex) {
    const usedByOtherPicks = new Set((activePack?.picks || []).filter((_, index) => index !== pickIndex));
    return games.filter((game) => {
      if (game.slug === "inflable") return false;
      if (game.slug === pack.base_game_slug) return false;
      if (usedByOtherPicks.has(game.slug)) return false;
      return true;
    });
  }

  function defaultPackPicks(pack) {
    const needed = Number(pack.picks_count || 0);
    return games
      .map((game) => game.slug)
      .filter((slug) => slug !== "inflable" && slug !== pack.base_game_slug)
      .slice(0, needed);
  }

  function addPack(pack) {
    const pickCount = Number(pack.picks_count || 0);
    if (pickCount > 0) {
      setActivePack({ pack, picks: defaultPackPicks(pack) });
      setCheckoutStep("select");
      setStatus("");
      setTimeout(() => packBuilderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      return;
    }

    const items = fixedPackItems(pack);
    setCart((current) => [
      ...current,
      {
        type: "pack",
        slug: pack.slug,
        name: pack.name,
        price: pack.price,
        items
      }
    ]);
    setActivePack(null);
    setCheckoutStep("select");
    setTimeout(() => reserveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function removeItem(index) {
    setCheckoutStep("select");
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateActivePackPick(index, value) {
    setStatus("");
    setActivePack((current) => {
      if (!current) return current;
      const picks = [...current.picks];
      picks[index] = value;
      return { ...current, picks };
    });
  }

  function addConfiguredPack() {
    if (!activePack) return;
    if (!canAddActivePack) {
      setStatus("Elige juegos distintos para completar el pack.");
      return;
    }

    const item = {
      type: "pack",
      slug: activePack.pack.slug,
      name: activePack.pack.name,
      price: activePack.pack.price,
      items: activePackItems
    };
    setCart((current) => [...current, item]);
    setActivePack(null);
    setCheckoutStep("select");
    setStatus("");
    setTimeout(() => reserveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function continueReservation() {
    if (!cart.length) {
      setStatus("Agrega al menos un juego o pack.");
      return;
    }
    setCheckoutStep("confirm");
    setStatus("");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
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
      setActivePack(null);
      setCheckoutStep("select");
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
      <div className="logo-top">
        <img
          src="https://cdn.shopify.com/s/files/1/0990/5078/3013/files/Diseno_sin_titulo_4.png?v=1773529966"
          alt="Juegazo"
        />
      </div>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">🎉 Arriendo de juegos para cumpleaños y eventos</p>
          <h1>
            <span>Diversion a domicilio con</span>
            <strong>reserva online sin costo</strong>
          </h1>
          <p className="lead">
            Elige tus juegos, aprovecha packs promocionales y en el siguiente paso confirmas comuna, fecha y horario.
          </p>
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
        <a className="primary-link hero-cta" href="#packs">Reservar juegos</a>
        <div className="stat-bar">🏀 Lo mas arrendado hoy: Basket Pro, Taca Taca y Hockey</div>
      </section>

      <section className="section" id="packs">
        <div className="section-head">
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

      {activePack ? (
        <section className="section pack-builder-section" id="detalle-pack" ref={packBuilderRef}>
          <div className="panel pack-builder">
            <div className="section-head compact-head">
              <h2>Elige los juegos del pack</h2>
            </div>
            <div className="builder-summary">
              <div>
                <span className="tag">{activePack.pack.tag}</span>
                <h3>{activePack.pack.name}</h3>
              </div>
              <strong>{money(activePack.pack.price)}</strong>
            </div>
            {activePack.pack.base_game_slug ? (
              <div className="locked-game">
                <span>Juego base incluido</span>
                <strong>{gameMap[activePack.pack.base_game_slug]?.name || activePack.pack.base_game_slug}</strong>
              </div>
            ) : null}
            <div className="pack-picks">
              {activePack.picks.map((pick, index) => (
                <label key={`${activePack.pack.slug}-pick-${index}`}>
                  {activePack.pack.base_game_slug ? `Juego adicional ${index + 1}` : `Juego ${index + 1}`}
                  <select value={pick} onChange={(event) => updateActivePackPick(index, event.target.value)}>
                    {eligiblePackGames(activePack.pack, index).map((game) => (
                      <option key={game.slug} value={game.slug}>
                        {game.name} - {money(game.price)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div className="builder-actions">
              <button type="button" onClick={addConfiguredPack}>Agregar pack a la reserva</button>
              <button type="button" className="ghost" onClick={() => setActivePack(null)}>Cambiar pack</button>
            </div>
            <p className="builder-note">No se puede repetir el mismo juego dentro del pack. El inflable se usa solo como base de sus packs.</p>
          </div>
        </section>
      ) : null}

      <section className="section" id="juegos">
        <div className="section-head">
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
                  <div className="game-actions">
                    <a href={`/productos/${game.slug}`}>Detalle</a>
                    <button type="button" onClick={() => addGame(game)}>Agregar</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reserve-layout" id="reservar" ref={reserveRef}>
        <div className="cart panel">
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
          <div className="cart-actions">
            <button type="button" className="ghost" onClick={() => document.getElementById("packs")?.scrollIntoView({ behavior: "smooth" })}>
              Agregar otro juego o pack
            </button>
            <button type="button" onClick={continueReservation} disabled={!cart.length}>
              Continuar
            </button>
          </div>
          <small>{source === "supabase" ? "Catalogo actualizado" : "Catalogo local"}</small>
        </div>

        <form className={`panel form ${checkoutStep === "confirm" ? "" : "form-disabled"}`} onSubmit={submitReservation} ref={formRef}>
          <h2>Confirmar reserva</h2>
          {checkoutStep !== "confirm" ? (
            <p className="form-gate">Primero selecciona juegos y toca Continuar.</p>
          ) : null}
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

      <section className="section news-strip" id="noticias">
        <div className="section-head">
          <h2>Noticias Juegazo</h2>
        </div>
        <div className="news-strip-grid">
          {newsPosts.slice(0, 3).map((post) => (
            <a className="news-mini" href={`/noticias/${post.slug}`} key={post.slug}>
              <span>{new Date(post.date).toLocaleDateString("es-CL")}</span>
              <strong>{post.title}</strong>
            </a>
          ))}
        </div>
        <a className="primary-link news-all" href="/noticias">Ver todas las noticias</a>
      </section>

      <a className="float-reserva" href="#packs">Reservar juegos</a>
    </>
  );
}
