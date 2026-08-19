import scheduledNewsPosts from "./news-scheduled.json";
import newsRelease from "./news-release.json";

export const SITE_URL = "https://juegazo.cl";

const existingNewsPosts = [
  {
    slug: "como-elegir-juegos-para-cumpleanos-infantiles",
    title: "Como elegir juegos para cumpleanos infantiles",
    date: "2026-08-12",
    excerpt: "Una guia rapida para combinar edades, espacio disponible y cantidad de invitados antes de reservar.",
    body: [
      "Elegir juegos para un cumpleanos infantil funciona mejor cuando partes por tres datos: edad de los ninos, espacio disponible y cantidad de invitados.",
      "Para grupos pequenos, un juego competitivo como Taca Taca, Hockey o Basket Pro puede mantener la energia alta. Para eventos con mas invitados, conviene sumar alternativas de rotacion para que nadie espere demasiado.",
      "Si el evento tiene mas de 5 invitados, la recomendacion es combinar al menos dos juegos. Asi se reparte la atencion, se evitan filas largas y el cumpleanos se siente mas dinamico."
    ]
  },
  {
    slug: "basket-pro-por-que-es-uno-de-los-mas-arrendados",
    title: "Basket Pro: por que es uno de los mas arrendados",
    date: "2026-08-12",
    excerpt: "Basket Pro destaca porque es facil de entender, rapido de jugar y muy bueno para rotar participantes.",
    body: [
      "Basket Pro funciona muy bien en cumpleanos y eventos porque no necesita explicaciones largas. Los invitados entienden el desafio de inmediato y se animan a competir por turnos.",
      "Es una buena base para armar un pack porque combina energia, movimiento y competencia sana. Cuando hay varios ninos, se puede complementar con Taca Taca, Hockey o Ping Pong JR.",
      "Para aprovecharlo mejor, deja un espacio despejado frente al juego y organiza rondas cortas. Eso mantiene el ritmo del evento y hace que mas personas participen."
    ]
  },
  {
    slug: "taca-taca-en-eventos-familiares",
    title: "Taca Taca en eventos familiares",
    date: "2026-08-12",
    excerpt: "Un clasico que funciona para ninos, jovenes y adultos en celebraciones con invitados de distintas edades.",
    body: [
      "El Taca Taca es uno de esos juegos que conecta generaciones. Lo pueden jugar ninos, jovenes y adultos sin preparacion previa.",
      "En eventos familiares aporta una pausa entretenida entre actividades mas movidas. Tambien es ideal cuando el espacio no alcanza para juegos mas grandes.",
      "Si buscas un pack equilibrado, Taca Taca combina bien con Basket Pro, Pool JR o Ping Pong JR."
    ]
  },
  {
    slug: "inflable-para-cumpleanos-que-considerar",
    title: "Inflable para cumpleanos: que considerar",
    date: "2026-08-12",
    excerpt: "Antes de reservar inflable, revisa edad recomendada, espacio, superficie y cantidad de ninos.",
    body: [
      "El inflable suele ser el centro visual de un cumpleanos infantil. Por eso conviene revisar antes el espacio disponible, el tipo de superficie y la edad de los ninos.",
      "Tambien es importante definir si quieres una experiencia mas fisica o un cumpleanos con estaciones de juego. En muchos casos, el inflable funciona mejor cuando se acompana con un juego adicional.",
      "Para ninos de 4 a 8 anos, el inflable puede ser una gran opcion si el lugar permite instalarlo con comodidad y supervision."
    ]
  },
  {
    slug: "hockey-y-ping-pong-pack-rapido-para-espacios-pequenos",
    title: "Hockey y Ping Pong: pack rapido para espacios pequenos",
    date: "2026-08-12",
    excerpt: "Una combinacion practica para eventos donde se necesita entretencion continua sin ocupar demasiado espacio.",
    body: [
      "Hockey y Ping Pong JR son una combinacion util cuando el evento necesita movimiento, competencia y rotacion rapida, pero sin ocupar tanto espacio.",
      "El Hockey aporta intensidad y reflejos. Ping Pong JR baja un poco el ritmo y permite alternar jugadores de forma simple.",
      "Este tipo de pack funciona bien para terrazas, quinchos, salones y celebraciones familiares con grupos medianos."
    ]
  },
  {
    slug: "pistolas-nerf-para-actividades-de-punteria",
    title: "Pistolas Nerf para actividades de punteria",
    date: "2026-08-12",
    excerpt: "Una alternativa entretenida para sumar precision, turnos y pequenos desafios dentro del evento.",
    body: [
      "Las Pistolas Nerf son ideales cuando quieres sumar una actividad de punteria y turnos. Funcionan bien como estacion complementaria dentro del evento.",
      "Al no depender solo de velocidad o fuerza, permiten que ninos de distintas edades participen con entusiasmo.",
      "Para eventos con mas invitados, conviene combinarlas con otro juego para mantener flujo constante y evitar esperas."
    ]
  },
  {
    slug: "tetris-tumble-xl-nuevo-juego-de-equilibrio",
    title: "Tetris Tumble XL: nuevo juego de equilibrio",
    date: "2026-08-12",
    excerpt: "El nuevo juego de equilibrio de Juegazo suma participacion grupal y risas para eventos desde los 6 anos.",
    body: [
      "Tetris Tumble XL llega como una alternativa distinta: un juego de equilibrio pensado para participar en grupo y generar momentos de tension entretenida.",
      "No tiene limite estricto de jugadores, por lo que se adapta bien a eventos con grupos grandes. La dinamica permite que los invitados entren y salgan del juego con facilidad.",
      "La recomendacion es combinarlo con al menos un juego adicional si el evento tiene mas de 5 invitados."
    ]
  },
  {
    slug: "packs-promocionales-para-ahorrar-en-eventos",
    title: "Packs promocionales para ahorrar en eventos",
    date: "2026-08-12",
    excerpt: "Los packs ayudan a armar una experiencia mas completa y conveniente que reservar juegos por separado.",
    body: [
      "Los packs promocionales permiten sumar mas entretencion sin tener que decidir juego por juego desde cero.",
      "La clave es elegir una base clara: Basket Pro, Inflable, Subfutbol o Pistolas Nerf, y luego agregar juegos que equilibren ritmo y espacio.",
      "Para cumpleanos con varios invitados, un pack suele rendir mejor porque crea estaciones simultaneas y mantiene a todos participando."
    ]
  },
  {
    slug: "juegos-para-eventos-en-rancagua-y-machali",
    title: "Juegos para eventos en Rancagua y Machali",
    date: "2026-08-12",
    excerpt: "Ideas para elegir juegos a domicilio en comunas cercanas, considerando traslado y espacio de instalacion.",
    body: [
      "En Rancagua y Machali, muchas celebraciones se realizan en casas, parcelas, condominios, quinchos y salones. Cada espacio pide una combinacion distinta.",
      "Para casas y quinchos, juegos compactos como Taca Taca, Hockey, Pool JR o Ping Pong JR pueden ser una buena base. Para espacios mas amplios, Basket Pro e Inflable destacan mas visualmente.",
      "Antes de reservar, conviene confirmar comuna, fecha, horario y el espacio aproximado disponible para instalar."
    ]
  },
  {
    slug: "como-armar-una-reserva-online-sin-abono",
    title: "Como armar una reserva online sin abono",
    date: "2026-08-12",
    excerpt: "El proceso esta pensado para elegir juegos primero y confirmar los datos del evento en el siguiente paso.",
    body: [
      "La reserva online de Juegazo esta pensada para ser simple: primero eliges juegos o packs, luego confirmas los datos del evento.",
      "No necesitas pagar un abono en la web para iniciar la solicitud. Despues de enviar la reserva, Juegazo revisa disponibilidad y confirma contigo por WhatsApp.",
      "Mientras mas clara sea la informacion de comuna, fecha y horario, mas rapido se puede validar la disponibilidad."
    ]
  }
];

export const allNewsPosts = [...existingNewsPosts, ...scheduledNewsPosts];

export const newsPosts = allNewsPosts
  .filter((post) => post.date <= newsRelease.releasedThrough)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getNewsPost(slug) {
  return newsPosts.find((post) => post.slug === slug);
}

export function formatNewsDate(date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T12:00:00Z`));
}
