const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const schedulePath = path.join(root, "lib/news-scheduled.json");
const releasePath = path.join(root, "lib/news-release.json");
const scheduled = JSON.parse(fs.readFileSync(schedulePath, "utf8"));
const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));

const parts = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Santiago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).formatToParts(new Date());
const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
const today = `${value.year}-${value.month}-${value.day}`;
const due = scheduled.filter((post) => post.date <= today);

if (due.length <= release.releasedCount) {
  console.log(`sin publicaciones pendientes para ${today}`);
  process.exit(0);
}

const latest = due[due.length - 1];
const nextRelease = {
  releasedThrough: latest.date,
  releasedCount: due.length
};
fs.writeFileSync(releasePath, `${JSON.stringify(nextRelease, null, 2)}\n`, "utf8");
console.log(`liberados ${due.length - release.releasedCount} articulo(s) hasta ${latest.date}`);
