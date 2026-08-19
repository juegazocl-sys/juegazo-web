const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "lib", "catalog.js");
const source = fs.readFileSync(catalogPath, "utf8");

function extractConstArray(name, nextName) {
  const end = nextName ? `\\n\\nexport const ${nextName}` : "\\n\\nexport function";
  const pattern = new RegExp(`export const ${name} =\\s*(\\[[\\s\\S]*?\\]);${end}`);
  const match = source.match(pattern);
  if (!match) throw new Error(`No pude leer ${name} desde lib/catalog.js`);
  return Function(`return ${match[1]}`)();
}

const games = extractConstArray("fallbackGames", "fallbackPacks");
const packs = extractConstArray("fallbackPacks", "fallbackServiceAreas");
const gameSlugs = new Set(games.map((game) => game.slug));

function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function eligiblePackGames(pack, picks = [], pickIndex = 0) {
  const usedByOtherPicks = new Set(picks.filter((_, index) => index !== pickIndex));
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

function fixedPackItems(pack) {
  if (pack.slug === "hockey-ping-pong") return ["hockey", "pingpong"];
  if (!Number(pack.picks_count || 0) && pack.base_game_slug) return [pack.base_game_slug];
  return [];
}

assert(gameSlugs.has("inflable"), "Falta el juego inflable en catalogo");

for (const pack of packs) {
  const pickCount = Number(pack.picks_count || 0);
  if (pack.base_game_slug) {
    assert(gameSlugs.has(pack.base_game_slug), `Pack ${pack.slug} usa base inexistente: ${pack.base_game_slug}`);
  }

  if (pickCount > 0) {
    const defaults = defaultPackPicks(pack);
    assert(defaults.length === pickCount, `Pack ${pack.slug} no tiene suficientes juegos por defecto`);
    assert(!defaults.includes("inflable"), `Pack ${pack.slug} incluye inflable como adicional por defecto`);
    assert(!defaults.includes(pack.base_game_slug), `Pack ${pack.slug} repite el juego base como adicional`);
    assert(uniq([pack.base_game_slug, ...defaults]).length === uniq(defaults).length + (pack.base_game_slug ? 1 : 0), `Pack ${pack.slug} tiene juegos duplicados`);

    defaults.forEach((pick, index) => {
      const options = eligiblePackGames(pack, defaults, index).map((game) => game.slug);
      assert(!options.includes("inflable"), `Pack ${pack.slug} permite inflable como opcion adicional`);
      assert(!options.includes(pack.base_game_slug), `Pack ${pack.slug} permite repetir el juego base`);
      assert(options.includes(pick), `Pack ${pack.slug} tiene una seleccion por defecto invalida: ${pick}`);
    });
  } else {
    const fixed = fixedPackItems(pack);
    fixed.forEach((slug) => assert(gameSlugs.has(slug), `Pack fijo ${pack.slug} usa juego inexistente: ${slug}`));
  }
}

const inflablePacks = packs.filter((pack) => pack.base_game_slug === "inflable");
assert(inflablePacks.length >= 2, "El inflable debe tener sus packs propios configurados");
assert(packs.filter((pack) => pack.base_game_slug !== "inflable").every((pack) => !defaultPackPicks(pack).includes("inflable")), "Inflable aparece en un pack que no es propio");

console.log("Reglas de reserva OK");
console.log(`Juegos revisados: ${games.length}`);
console.log(`Packs revisados: ${packs.length}`);
console.log(`Packs propios de inflable: ${inflablePacks.map((pack) => pack.name).join(" | ")}`);
