import { fallbackGames, fallbackPacks, fallbackServiceAreas } from "./catalog";
import { getSupabasePublic } from "./supabase-public";

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
    supabase.from("games").select("*").eq("active", true).order("sort_order"),
    supabase.from("packs").select("*").eq("active", true).order("sort_order"),
    supabase.from("service_areas").select("*").eq("active", true).order("sort_order")
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
    serviceAreas: areasResult.data?.length ? areasResult.data : fallbackServiceAreas,
    source: "supabase"
  };
}

