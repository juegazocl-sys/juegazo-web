import { fallbackGames, money } from "./catalog";
import { SITE_URL } from "./news";

const productBodies = {
  basket: [
    "Basket Pro es uno de los juegos mas pedidos para cumpleanos y eventos porque se entiende rapido, permite competencia por turnos y mantiene alta la energia del grupo.",
    "Funciona muy bien como juego base para packs con invitados desde los 6 anos. Si el evento tiene mas de 5 invitados, conviene combinarlo con al menos otro juego para evitar filas largas.",
    "El arriendo incluye el juego instalado en el evento y la coordinacion previa de fecha, comuna y horario."
  ],
  taca: [
    "Taca Taca es un clasico para eventos familiares, cumpleanos y celebraciones con invitados de distintas edades.",
    "Permite hasta 4 jugadores simultaneos y funciona bien en terrazas, quinchos, salones y casas con espacio medio.",
    "Es una buena alternativa para complementar juegos de mayor movimiento como Basket Pro o Inflable."
  ],
  hockey: [
    "Hockey agrega competencia rapida y mucho ritmo al evento. Es ideal para turnos cortos y partidas entre dos jugadores.",
    "Este juego necesita conexion electrica, por lo que conviene confirmar el lugar de instalacion antes de reservar.",
    "Tambien funciona como parte de packs express para espacios mas pequenos."
  ],
  inflable: [
    "El inflable es una opcion visual y entretenida para cumpleanos infantiles, especialmente para ninos entre 4 y 8 anos.",
    "Antes de reservarlo, revisa que el lugar tenga espacio suficiente, superficie adecuada y supervision durante el evento.",
    "Para eventos con varios invitados suele rendir mejor junto a un juego adicional."
  ],
  nerf: [
    "Pistolas Nerf suma una estacion de punteria con turnos, desafios simples y participacion de varios ninos.",
    "Incluye pistolas y una tela con puntaje, por lo que funciona bien como actividad complementaria dentro del evento.",
    "Es una alternativa practica para combinar con juegos de mesa o competencia rapida."
  ],
  subfutbol: [
    "Subfutbol es un juego de mesa grande y llamativo que mezcla futbol y competencia directa.",
    "Funciona bien para eventos con ninos desde los 5 anos y puede combinarse con un juego adicional para mejorar la rotacion.",
    "Por sus medidas, conviene dejar un espacio despejado para jugar con comodidad."
  ],
  pool: [
    "Pool JR es una opcion compacta para sumar precision, calma y turnos dentro de un cumpleanos o evento familiar.",
    "Es recomendable para ninos desde los 6 anos y funciona muy bien como complemento de packs.",
    "Por su tamano, se adapta a casas, terrazas y salones pequenos."
  ],
  pingpong: [
    "Ping Pong JR es un complemento liviano, rapido y facil de integrar en eventos con espacios acotados.",
    "Permite partidas cortas entre dos jugadores y ayuda a mantener la participacion mientras otros juegos estan ocupados.",
    "Es especialmente util en packs express o como juego adicional."
  ],
  tetris: [
    "Tetris Tumble XL es un juego de equilibrio pensado para participacion grupal y momentos de tension entretenida.",
    "No tiene limite estricto de jugadores, por lo que se adapta bien a eventos con grupos grandes y rotacion constante.",
    "Si el evento tiene mas de 5 invitados, la recomendacion es combinarlo con al menos otro juego."
  ]
};

export function getProductSlug(game) {
  return game.slug;
}

export function getProductUrl(gameOrSlug) {
  const slug = typeof gameOrSlug === "string" ? gameOrSlug : getProductSlug(gameOrSlug);
  return `${SITE_URL}/productos/${slug}`;
}

export function getProductDescription(game) {
  return `Arriendo de ${game.name} para cumpleanos y eventos. ${game.players}, edad recomendada ${game.age_recommendation}, medidas ${game.dimensions}. Precio desde ${money(game.price)}.`;
}

export function getProductBody(game) {
  return productBodies[game.slug] || [
    `${game.name} esta disponible para arriendo en cumpleanos y eventos con reserva online.`,
    `La edad recomendada es ${game.age_recommendation} y sus medidas son ${game.dimensions}.`,
    "Despues de enviar la solicitud, Juegazo confirma disponibilidad por WhatsApp."
  ];
}

export function getProductJsonLd(game) {
  const url = getProductUrl(game);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}#business`,
        name: "Juegazo",
        url: SITE_URL,
        image: game.image_url,
        areaServed: [
          "Rancagua",
          "Machali",
          "Requinoa",
          "Graneros",
          "Rengo",
          "San Vicente"
        ]
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Arriendo ${game.name}`,
        serviceType: "Arriendo de juegos para eventos",
        category: "Entretencion para eventos",
        description: getProductDescription(game),
        image: game.image_url,
        provider: {
          "@id": `${SITE_URL}#business`
        },
        areaServed: [
          "Rancagua",
          "Machali",
          "Requinoa",
          "Graneros",
          "Rengo",
          "San Vicente"
        ],
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: Number(String(game.age_recommendation).replace(/\D/g, "")) || 2
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Jugadores",
            value: game.players
          },
          {
            "@type": "PropertyValue",
            name: "Edad recomendada",
            value: game.age_recommendation
          },
          {
            "@type": "PropertyValue",
            name: "Medidas",
            value: game.dimensions
          }
        ],
        offers: {
          "@type": "Offer",
          url,
          price: String(Number(game.price || 0)),
          priceCurrency: "CLP",
          availability: "https://schema.org/InStock",
          businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          seller: {
            "@id": `${SITE_URL}#business`
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: SITE_URL
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Juegos en arriendo",
            item: `${SITE_URL}/productos`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: game.name,
            item: url
          }
        ]
      }
    ]
  };
}

export function getProductBySlug(slug) {
  return fallbackGames.find((game) => getProductSlug(game) === slug);
}
