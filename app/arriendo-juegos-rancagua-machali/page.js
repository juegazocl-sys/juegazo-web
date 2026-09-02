import Link from "next/link";
import { SITE_URL } from "../../lib/news";

const pageUrl = `${SITE_URL}/arriendo-juegos-rancagua-machali`;

export const metadata = {
  title: "Arriendo de juegos en Rancagua y Machalí | Juegazo",
  description: "Arriendo de Taca Taca y juegos para cumpleaños y eventos a domicilio en Rancagua, Machalí y comunas de la Región de O'Higgins.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Arriendo de juegos en Rancagua y Machalí | Juegazo",
    description: "Juegos para cumpleaños y eventos con despacho, instalación y retiro coordinado en Rancagua, Machalí y la Región de O'Higgins.",
    url: pageUrl,
    type: "website"
  }
};

const faq = [
  {
    question: "¿Arriendan Taca Taca en Rancagua?",
    answer: "Sí. Puedes solicitar el arriendo de Taca Taca para cumpleaños, celebraciones familiares y eventos en Rancagua, sujeto a disponibilidad para la fecha y el horario elegidos."
  },
  {
    question: "¿El servicio llega a Machalí?",
    answer: "Sí. Juegazo presta servicio a domicilio en Machalí y coordina previamente el lugar, acceso, horario de instalación y retiro."
  },
  {
    question: "¿Qué incluye el arriendo?",
    answer: "La solicitud considera el juego elegido y la coordinación de entrega, instalación y retiro. Antes de confirmar revisamos comuna, fecha, horario, acceso y espacio disponible."
  },
  {
    question: "¿Puedo reservar varios juegos para un cumpleaños?",
    answer: "Sí. Puedes elegir juegos individuales o packs para crear varias estaciones y reducir los tiempos de espera entre invitados."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Arriendo de juegos en Rancagua y Machalí",
      serviceType: "Arriendo de juegos para cumpleaños y eventos",
      url: pageUrl,
      description: "Servicio a domicilio de arriendo de juegos para cumpleaños y eventos en Rancagua, Machalí y comunas de la Región de O'Higgins.",
      provider: { "@id": `${SITE_URL}#business` },
      areaServed: [
        { "@type": "City", name: "Rancagua" },
        { "@type": "City", name: "Machalí" },
        { "@type": "AdministrativeArea", name: "Región del Libertador General Bernardo O'Higgins" }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Arriendo de juegos en Rancagua y Machalí", item: pageUrl }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ]
};

export default function ArriendoJuegosRancaguaMachaliPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="news-hero local-hero">
        <Link className="back-link" href="/">Volver a Juegazo</Link>
        <span className="tag">Servicio a domicilio en O&apos;Higgins</span>
        <h1>Arriendo de juegos en Rancagua y Machalí</h1>
        <p>Juegos para cumpleaños, celebraciones familiares y eventos, con entrega, instalación y retiro coordinados.</p>
        <div className="local-actions">
          <Link className="primary-link" href="/#packs">Revisar juegos y packs</Link>
          <Link className="ghost-link" href="/productos/taca">Ver arriendo de Taca Taca</Link>
        </div>
      </section>

      <article className="local-page">
        <section className="product-content">
          <h2>Juegos para cumpleaños y eventos en la Región de O&apos;Higgins</h2>
          <p>Juegazo lleva juegos a domicilio para eventos en Rancagua, Machalí y otras comunas que podamos cubrir según la fecha, el horario y la ruta. No necesitas trasladar los equipos: coordinamos contigo el acceso y el espacio de instalación antes de confirmar.</p>
          <p>Puedes elegir opciones como Basket Pro, Hockey, Pistolas Nerf, Ping Pong JR, Pool JR, Inflable y Tetris Tumble XL, además de combinaciones pensadas para mantener a más invitados participando.</p>
        </section>

        <section className="product-content local-highlight">
          <h2>Arriendo de Taca Taca en Rancagua</h2>
          <p>El Taca Taca es una alternativa práctica para cumpleaños y eventos familiares porque permite hasta cuatro jugadores, funciona bien en quinchos, terrazas y salones, y se puede combinar con juegos de mayor movimiento.</p>
          <p>Antes de reservar revisa sus medidas, el valor vigente y la edad recomendada en la ficha del producto. La disponibilidad se confirma después de recibir los datos del evento.</p>
          <Link className="primary-link" href="/productos/taca">Ver precio y medidas del Taca Taca</Link>
        </section>

        <section className="product-content">
          <h2>Cómo solicitar el servicio</h2>
          <ol className="product-steps">
            <li>Elige un juego o uno de los packs disponibles.</li>
            <li>Indica Rancagua, Machalí u otra comuna de O&apos;Higgins, junto con la fecha y los horarios.</li>
            <li>Juegazo revisa disponibilidad, traslado y condiciones de instalación.</li>
            <li>Recibes la confirmación por WhatsApp antes del evento.</li>
          </ol>
        </section>

        <section className="product-content" aria-labelledby="local-faq-title">
          <h2 id="local-faq-title">Preguntas frecuentes</h2>
          <div className="local-faq">
            {faq.map((item) => (
              <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
