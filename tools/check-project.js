const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const required = [
  "README.md",
  "package.json",
  "next.config.js",
  "vercel.json",
  ".env.example",
  "app/page.js",
  "app/layout.js",
  "app/api/health/route.js",
  "app/api/reservations/route.js",
  "lib/supabase-admin.js",
  "supabase/migrations/001_initial_schema.sql",
  "docs/shopify-audit.md",
  "docs/migration-plan.md",
  "docs/accounts-checklist.md"
];

for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Falta ${file}`);
  console.log(`${file} ok`);
}

const sql = fs.readFileSync(path.join(root, "supabase/migrations/001_initial_schema.sql"), "utf8");
for (const table of ["games", "packs", "service_areas", "reservations", "shopify_imports"]) {
  if (!sql.includes(`public.${table}`)) throw new Error(`Falta tabla ${table}`);
}
console.log("schema ok");

