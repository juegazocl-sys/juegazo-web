"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { money } from "../../lib/catalog";

const defaultRegion = "Región de O'Higgins";

const metropolitanCommunes = new Set([
  "Providencia",
  "Nunoa",
  "Ñuñoa",
  "Penalolen",
  "Peñalolén",
  "La Reina",
  "Las Condes",
  "Vitacura",
  "Lo Barnechea",
  "La Dehesa"
]);

const eventTypes = [
  "Cumpleaños",
  "Fiesta privada",
  "Evento comunitario",
  "Evento escolar",
  "Evento empresa",
  "Otro"
];

const gameDetails = {
  basket: [
    "Juego con marcador electronico e incluye pilas",
    "Permite hasta 2 jugadores simultaneos",
    "Edad recomendada: +6",
    "Recomendacion: combinar con al menos 1 juego si el evento tiene mas de 5 invitados",
    "Medidas: 210 x 205 x 65 cm"
  ],
  taca: [
    "Juego de futbol manual",
    "Permite hasta 4 jugadores simultaneos",
    "Edad recomendada: +4",
    "Recomendacion: combinar con al menos 1 juego si el evento tiene mas de 5 invitados",
    "Medidas: 120 x 60 x 65 cm"
  ],
  hockey: [
    "Juego electrico con marcador digital",
    "Permite hasta 2 jugadores simultaneos",
    "Edad recomendada: +6",
    "Este juego necesita conexion electrica",
    "Medidas: 152 x 78 x 80 cm"
  ],
  nerf: [
    "Incluye 5 pistolas Nerf y tela con puntaje",
    "Permite hasta 5 jugadores simultaneos",
    "Edad recomendada: +2",
    "Recomendado combinar con al menos 1 juego",
    "Medidas: 150 x 150 x 120 cm"
  ],
  subfutbol: [
    "Juego de mesa grande con dinamica de futbol",
    "Permite hasta 2 jugadores simultaneos",
    "Edad recomendada: +5",
    "Recomendado combinar con al menos 1 juego",
    "Medidas: 210 x 70 x 100 cm"
  ],
  pool: [
    "Juego en tamano para ninos",
    "Permite hasta 2 jugadores simultaneos",
    "Edad recomendada: +6",
    "Recomendado combinar con al menos 1 juego",
    "Medidas: 120 x 60 x 65 cm"
  ],
  pingpong: [
    "Juego de paletas",
    "Permite hasta 2 jugadores simultaneos",
    "Edad recomendada: +5",
    "Recomendado combinar con al menos 1 juego",
    "Medidas: 120 x 60 x 65 cm"
  ],
  inflable: [
    "2 versiones: acuatico o con pelotas",
    "Permite hasta 3 jugadores simultaneos",
    "Rango de edad: 4 a 8 anos",
    "Este juego se puede reservar solo o en sus packs propios con juegos adicionales",
    "Medidas: 300 x 400 x 600 cm"
  ],
  tetris: [
    "Juego de equilibrio",
    "Sin limite de jugadores",
    "Edad recomendada: +6",
    "Recomendacion: combinar con al menos 1 juego si el evento tiene mas de 5 invitados",
    "Medidas: 160 x 150 x 65 cm"
  ]
};

function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

export default function ReservationClient({ games, packs, serviceAreas, source }) {
  const normalizedServiceAreas = useMemo(() => serviceAreas.map((area) => ({
    ...area,
    region: area.region || (metropolitanCommunes.has(area.commune) ? "Región Metropolitana" : defaultRegion)
  })), [serviceAreas]);
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(normalizedServiceAreas.map((area) => area.region).filter(Boolean)));
    return [
      defaultRegion,
      "Región Metropolitana",
      ...uniqueRegions.filter((region) => region !== defaultRegion && region !== "Región Metropolitana")
    ];
  }, [normalizedServiceAreas]);
  const [cart, setCart] = useState([]);
  const [activePack, setActivePack] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState("select");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [showFloatReserve, setShowFloatReserve] = useState(true);
  const packBuilderRef = useRef(null);
  const reserveRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    event_region: defaultRegion,
    event_commune: normalizedServiceAreas.find((area) => area.region === defaultRegion)?.commune || "Rancagua",
    event_type: eventTypes[0],
    children_count: "",
    event_date: "",
    start_time: "",
    end_time: "",
    notes: ""
  });

  const gameMap = useMemo(() => Object.fromEntries(games.map((game) => [game.slug, game])), [games]);
  const regionAreas = useMemo(
    () => normalizedServiceAreas.filter((area) => area.region === form.event_region),
    [normalizedServiceAreas, form.event_region]
  );
  const serviceArea = normalizedServiceAreas.find((area) => area.region === form.event_region && area.commune === form.event_commune)
    || normalizedServiceAreas.find((area) => area.commune === form.event_commune);
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

  function updateRegion(region) {
    const firstCommune = normalizedServiceAreas.find((area) => area.region === region)?.commune || "";
    setForm((current) => ({ ...current, event_region: region, event_commune: firstCommune }));
  }

  useEffect(() => {
    function updateFloatVisibility() {
      const packsSection = document.getElementById("packs");
      if (!packsSection) return;
      const hideAfter = packsSection.offsetTop + packsSection.offsetHeight - 80;
      setShowFloatReserve(window.scrollY < hideAfter);
    }

    updateFloatVisibility();
    window.addEventListener("scroll", updateFloatVisibility, { passive: true });
    window.addEventListener("resize", updateFloatVisibility);
    return () => {
      window.removeEventListener("scroll", updateFloatVisibility);
      window.removeEventListener("resize", updateFloatVisibility);
    };
  }, []);

  function addGame(game) {
    setConfirmedReservation(null);
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
    setConfirmedReservation(null);
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
    setConfirmedReservation(null);
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
    if (activePack.picks.includes("inflable")) {
      setStatus("El inflable solo se puede usar como base en sus packs propios.");
      return;
    }
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

  function resetReservation() {
    setCart([]);
    setActivePack(null);
    setCheckoutStep("select");
    setStatus("");
    setConfirmedReservation(null);
    setForm((current) => ({
      ...current,
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      event_type: eventTypes[0],
      children_count: "",
      event_date: "",
      start_time: "",
      end_time: "",
      notes: ""
    }));
    setTimeout(() => document.getElementById("packs")?.scrollIntoView({ behavior: "smooth" }), 50);
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
      setConfirmedReservation({
        id: data.reservation?.id,
        form: { ...form },
        items: [...cart],
        subtotal,
        transfer,
        total,
        emailOk: Boolean(data.email?.ok)
      });
      setCart([]);
      setActivePack(null);
      setCheckoutStep("select");
      setStatus("");
      setForm((current) => ({ ...current, customer_name: "", customer_phone: "", customer_email: "", notes: "" }));
      setTimeout(() => reserveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
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
            <span>Diversion a domicilio</span>
            <strong>Reserva online sin costo</strong>
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
            preload="metadata"
            aria-label="Demostracion de juegos Juegazo en un evento"
          />
        </div>
        <div className="stat-bar">🏀 Lo mas arrendado hoy: Basket Pro, Taca Taca y Hockey</div>
      </section>

      <section className="section" id="packs">
        <div className="section-head">
          <div>
            <h2>Packs recomendados</h2>
            <p className="section-note">El inflable se puede reservar solo o como base en sus packs propios. No aparece como juego adicional en otros packs.</p>
          </div>
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
              <div className="game-media">
                <img src={game.image_url} alt={game.name} />
                <h3>{game.name}</h3>
              </div>
              <div className="game-body">
                <div className="game-badges">
                  <span className="tag">{game.tag}</span>
                  <span className="tag price-tag">{money(game.price)}</span>
                </div>
                <ul className="game-detail-list">
                  {(gameDetails[game.slug] || [
                    game.players,
                    `Edad recomendada: ${game.age_recommendation}`,
                    `Medidas: ${game.dimensions}`
                  ]).map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <div className="card-bottom">
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

      {confirmedReservation ? (
      <section className="section confirmation-section" id="reserva-enviada" ref={reserveRef}>
        <div className="confirmation-panel">
          <div className="confirmation-copy">
            <span className="confirmation-kicker">Reserva enviada</span>
            <h2>Gracias, recibimos tu solicitud</h2>
            <p>
              Revisaremos disponibilidad y te contactaremos por WhatsApp para confirmar los detalles del evento.
            </p>
            <div className="confirmation-id">
              <span>ID reserva</span>
              <strong>{confirmedReservation.id}</strong>
            </div>
          </div>

          <div className="confirmation-summary">
            <div className="summary-block">
              <h3>Datos del evento</h3>
              <dl>
                <div><dt>Nombre</dt><dd>{confirmedReservation.form.customer_name}</dd></div>
                <div><dt>WhatsApp</dt><dd>{confirmedReservation.form.customer_phone}</dd></div>
                {confirmedReservation.form.customer_email ? (
                  <div><dt>Email</dt><dd>{confirmedReservation.form.customer_email}</dd></div>
                ) : null}
                <div><dt>Tipo</dt><dd>{confirmedReservation.form.event_type}</dd></div>
                <div><dt>Niños invitados</dt><dd>{confirmedReservation.form.children_count === "" ? "Por definir" : confirmedReservation.form.children_count}</dd></div>
                <div><dt>Región</dt><dd>{confirmedReservation.form.event_region}</dd></div>
                <div><dt>Comuna</dt><dd>{confirmedReservation.form.event_commune}</dd></div>
                <div><dt>Fecha</dt><dd>{confirmedReservation.form.event_date}</dd></div>
                {confirmedReservation.form.start_time || confirmedReservation.form.end_time ? (
                  <div>
                    <dt>Horario</dt>
                    <dd>
                      {[confirmedReservation.form.start_time, confirmedReservation.form.end_time].filter(Boolean).join(" a ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="summary-block">
              <h3>Productos reservados</h3>
              <div className="confirmation-items">
                {confirmedReservation.items.map((item, index) => (
                  <article key={`${item.slug}-${index}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.items.map((slug) => gameMap[slug]?.name || slug).join(" + ")}</span>
                    </div>
                    <b>{money(item.price)}</b>
                  </article>
                ))}
              </div>
              <div className="confirmation-total">
                <div><span>Subtotal</span><strong>{money(confirmedReservation.subtotal)}</strong></div>
                <div><span>Traslado</span><strong>{money(confirmedReservation.transfer)}</strong></div>
                <div><span>Total</span><strong>{money(confirmedReservation.total)}</strong></div>
              </div>
            </div>

            {confirmedReservation.form.notes ? (
              <div className="summary-block summary-notes">
                <h3>Notas</h3>
                <p>{confirmedReservation.form.notes}</p>
              </div>
            ) : null}
          </div>

          <div className="confirmation-actions">
            <a className="primary-link" href={`https://wa.me/56989010309?text=${encodeURIComponent(`Hola Juegazo, envie una reserva desde la web. ID: ${confirmedReservation.id}`)}`}>
              Escribir por WhatsApp
            </a>
            <button type="button" className="ghost" onClick={resetReservation}>Hacer otra reserva</button>
          </div>
        </div>
      </section>
      ) : cart.length || checkoutStep === "confirm" || status ? (
      <section className="section reserve-layout" id="reservar" ref={reserveRef}>
        <div className="cart panel">
          <h2>{checkoutStep === "confirm" ? "Resumen de reserva" : "Reserva"}</h2>
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
          ) : null}
          <div className="totals">
            <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div><span>Traslado</span><strong>{money(transfer)}</strong></div>
            <div><span>Total</span><strong>{money(total)}</strong></div>
          </div>
          {checkoutStep !== "confirm" ? (
          <div className="cart-actions">
            <button type="button" className="ghost" onClick={() => document.getElementById("packs")?.scrollIntoView({ behavior: "smooth" })}>
              Agregar otro juego o pack
            </button>
            <button type="button" onClick={continueReservation} disabled={!cart.length}>
              Continuar
            </button>
          </div>
          ) : null}
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
          <div className="form-row two-columns">
            <label>
              Tipo de evento
              <select value={form.event_type} onChange={(event) => updateField("event_type", event.target.value)}>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Cantidad de niños invitados
              <input
                min="0"
                inputMode="numeric"
                type="number"
                value={form.children_count}
                onChange={(event) => updateField("children_count", event.target.value)}
              />
            </label>
          </div>
          <label>
            Región
            <select value={form.event_region} onChange={(event) => updateRegion(event.target.value)}>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </label>
          <label>
            Comuna
            <select value={form.event_commune} onChange={(event) => updateField("event_commune", event.target.value)}>
              {regionAreas.map((area) => (
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
      ) : null}

      <section className="section business-info" aria-labelledby="como-funciona-title">
        <div>
          <p className="eyebrow">Servicio local</p>
          <h2 id="como-funciona-title">Como funciona el arriendo de juegos</h2>
          <ol>
            <li>Elige juegos individuales o un pack y revisa el precio publicado.</li>
            <li>Indica comuna, fecha y horario para solicitar disponibilidad.</li>
            <li>Juegazo revisa la solicitud y coordina la reserva por WhatsApp.</li>
          </ol>
        </div>
        <div>
          <h2>Cobertura y traslado</h2>
          <p>El valor de traslado se calcula segun la region y comuna elegida en el formulario. La disponibilidad final se confirma por WhatsApp.</p>
          <a className="primary-link" href="tel:+56989010309">Contactar al +56 9 8901 0309</a>
        </div>
      </section>

      {showFloatReserve && !cart.length && !activePack && !confirmedReservation && checkoutStep === "select" ? (
        <a className="float-reserva" href="#packs">Reservar juegos</a>
      ) : null}
    </>
  );
}
