export const fallbackGames = [
  {
    slug: "basket",
    name: "Basket Pro",
    tag: "Mas pedido",
    price: 35000,
    players: "Hasta 2 jugadores",
    age_recommendation: "+6",
    dimensions: "210 x 205 x 65 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/3.png?v=1773523708"
  },
  {
    slug: "taca",
    name: "Taca Taca",
    tag: "Top ventas",
    price: 30000,
    players: "Hasta 4 jugadores",
    age_recommendation: "+4",
    dimensions: "120 x 60 x 65 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/2.png?v=1773523705"
  },
  {
    slug: "hockey",
    name: "Hockey",
    tag: "Muy pedido",
    price: 35000,
    players: "Hasta 2 jugadores",
    age_recommendation: "+6",
    dimensions: "152 x 78 x 80 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/1_1.png?v=1773523659"
  },
  {
    slug: "inflable",
    name: "Inflable",
    tag: "Cumpleanos",
    price: 55000,
    players: "Hasta 3 jugadores",
    age_recommendation: "4 a 8 anos",
    dimensions: "300 x 400 x 600 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/8.png?v=1773523721"
  },
  {
    slug: "nerf",
    name: "Pistolas Nerf",
    tag: "Punteria",
    price: 30000,
    players: "Hasta 5 jugadores",
    age_recommendation: "+2",
    dimensions: "150 x 150 x 120 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/7.png?v=1773523718"
  },
  {
    slug: "subfutbol",
    name: "Subfutbol",
    tag: "Mesa",
    price: 40000,
    players: "Hasta 2 jugadores",
    age_recommendation: "+5",
    dimensions: "210 x 70 x 100 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/6.png?v=1773523715"
  },
  {
    slug: "pool",
    name: "Pool JR",
    tag: "Ninos",
    price: 25000,
    players: "Hasta 2 jugadores",
    age_recommendation: "+6",
    dimensions: "120 x 60 x 65 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/4.png?v=1773523709"
  },
  {
    slug: "pingpong",
    name: "Ping Pong JR",
    tag: "Complemento",
    price: 20000,
    players: "Hasta 2 jugadores",
    age_recommendation: "+5",
    dimensions: "120 x 60 x 65 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/5.png?v=1773523712"
  },
  {
    slug: "tetris",
    name: "Tetris Tumble XL",
    tag: "Equilibrio",
    price: 40000,
    players: "Sin limite de jugadores",
    age_recommendation: "+6",
    dimensions: "160 x 150 x 65 cm",
    image_url: "https://cdn.shopify.com/s/files/1/0990/5078/3013/files/25B9036A-F026-4BC2-A9B6-23B68EB7FF4A.png?v=1780156655"
  }
];

export const fallbackPacks = [
  { slug: "basket-2-juegos", name: "Basket + 2 juegos a eleccion", tag: "Promocion", price: 69900, picks_count: 2, base_game_slug: "basket" },
  { slug: "basket-1-juego", name: "Basket + 1 juego a eleccion", tag: "Promocion", price: 54900, picks_count: 1, base_game_slug: "basket" },
  { slug: "subfutbol-1-juego", name: "Subfutbol + 1 juego a eleccion", tag: "Catalogo", price: 64900, picks_count: 1, base_game_slug: "subfutbol" },
  { slug: "inflable-1-juego", name: "Inflable + 1 juego a eleccion", tag: "Cumpleanos", price: 79900, picks_count: 1, base_game_slug: "inflable" },
  { slug: "inflable-2-juegos", name: "Inflable + 2 juegos a eleccion", tag: "Mas completo", price: 94900, picks_count: 2, base_game_slug: "inflable" },
  { slug: "hockey-ping-pong", name: "Hockey + Ping Pong JR", tag: "Express", price: 44900, picks_count: 0 },
  { slug: "nerf-1-juego", name: "Pistolas Nerf + 1 juego a eleccion", tag: "Catalogo", price: 54900, picks_count: 1, base_game_slug: "nerf" },
  { slug: "silver", name: "Pack Silver - 4 juegos a eleccion", tag: "Pack Silver", price: 99900, picks_count: 4 },
  { slug: "golden", name: "Pack Golden - 5 juegos a eleccion", tag: "Pack Golden", price: 119900, picks_count: 5 }
];

export const fallbackServiceAreas = [
  ["Rancagua", 0],
  ["Machali", 3000],
  ["Requinoa", 4000],
  ["Lo Miranda", 5000],
  ["Codegua", 4000],
  ["Coinco", 7000],
  ["Coltauco", 7000],
  ["Donihue", 6000],
  ["Graneros", 4000],
  ["Las Cabras", 7000],
  ["Malloa", 9000],
  ["Mostazal", 7000],
  ["Olivar", 6000],
  ["Peumo", 9000],
  ["Pichidegua", 10000],
  ["Quinta de Tilcoco", 10000],
  ["Rengo", 10000],
  ["San Vicente", 10000],
  ["Coya", 10000]
].map(([commune, transfer_price], index) => ({ commune, transfer_price, sort_order: index + 1 }));

export function money(value) {
  return "$" + Number(value || 0).toLocaleString("es-CL");
}

