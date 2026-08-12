const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const projectRoot = path.resolve(__dirname, "..");
const sources = [
  path.join(root, "Juegazo landing.txt"),
  path.join(root, "juegazo-vercel", "index.html")
].filter((file) => fs.existsSync(file));

function extractArray(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  if (!match) return [];
  return Function(`return ${match[1]}`)();
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanText(value) {
  if (typeof value !== "string") return value;
  const normalized = value
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Â·/g, "·");
  return normalized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/·/g, "-");
}

function cleanObject(item) {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, cleanText(value)])
  );
}

const games = [];
const packs = [];
const assets = [];

for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  extractArray(text, "GAMES").forEach((item) => games.push(cleanObject({ ...item, source: path.relative(root, file) })));
  extractArray(text, "PACKS").forEach((item) => packs.push(cleanObject({ ...item, source: path.relative(root, file) })));
  [...text.matchAll(/https:\/\/cdn\.shopify\.com\/[^"' <>)]+/g)].forEach((match) => {
    assets.push({ url: match[0], source: path.relative(root, file) });
  });
}

const report = {
  generated_at: new Date().toISOString(),
  sources: sources.map((file) => path.relative(root, file)),
  games: uniqueBy(games, (item) => item.id),
  packs: uniqueBy(packs, (item) => item.id),
  remote_assets: uniqueBy(assets, (item) => item.url)
};

const reportsDir = path.join(projectRoot, "reports");
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(path.join(reportsDir, "local-audit.json"), JSON.stringify(report, null, 2), "utf8");

const md = [
  "# Auditoria local automatica",
  "",
  `Generado: ${report.generated_at}`,
  "",
  "## Fuentes",
  ...report.sources.map((source) => `- ${source}`),
  "",
  "## Juegos",
  "| ID | Nombre | Precio | Tag |",
  "|---|---|---:|---|",
  ...report.games.map((game) => `| ${game.id} | ${game.name} | ${game.price} | ${game.tag || ""} |`),
  "",
  "## Packs",
  "| ID | Nombre | Precio | Tipo |",
  "|---|---|---:|---|",
  ...report.packs.map((pack) => `| ${pack.id} | ${pack.name} | ${pack.price} | ${pack.fixed ? "fixed" : pack.picksOnly ? "picks_only" : "base_plus_picks"} |`),
  "",
  "## Assets remotos recuperados",
  ...report.remote_assets.map((asset) => `- ${asset.url}`)
].join("\n");

fs.writeFileSync(path.join(reportsDir, "local-audit.md"), md, "utf8");
console.log(`Juegos: ${report.games.length}`);
console.log(`Packs: ${report.packs.length}`);
console.log(`Assets remotos: ${report.remote_assets.length}`);
