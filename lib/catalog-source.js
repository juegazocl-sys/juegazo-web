import { fallbackGames, fallbackPacks, fallbackServiceAreas } from "./catalog";
import { getSupabasePublic } from "./supabase-public";

function mergeServiceAreas(databaseAreas = []) {
  const byCommune = new Map();
  fallbackServiceAreas.forEach((area) => byCommune.set(area.commune, area));
  databaseAreas.forEach((area) => byCommune.set(area.commune, {
    ...byCommune.get(area.commune),
    ...area
  }));
  return Array.from(byCommune.values()).sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
}

export async function getCatalog() {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return {
      games: fallbackGames,
      packs: fallbackPacks,
      serviceAreas: fallbackServiceAreas,
      source: "fallback"
    };
  }

  const [gamesResult, packsResult, areasResult] = await Promise.all([
    supabase.from("juegazo_games").select("*").eq("active", true).order("sort_order"),
    supabase.from("juegazo_packs").select("*").eq("active", true).order("sort_order"),
    supabase.from("juegazo_service_areas").select("*").eq("active", true).order("sort_order")
  ]);

  if (gamesResult.error || packsResult.error || areasResult.error) {
    return {
      games: fallbackGames,
      packs: fallbackPacks,
      serviceAreas: fallbackServiceAreas,
      source: "fallback"
    };
  }

  return {
    games: gamesResult.data?.length ? gamesResult.data : fallbackGames,
    packs: packsResult.data?.length ? packsResult.data : fallbackPacks,
    serviceAreas: mergeServiceAreas(areasResult.data || []),
    source: "supabase"
  };
}


