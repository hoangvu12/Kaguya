import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useAnimeDetails = (animeId: number) => {
  return useSupabaseSingleQuery(
    ["anime", animeId],
    () =>
      supabase
        .from<Anime>("anime")
        .select(
          `
        *,
        characters:anime_characters!anime_id(*, character:character_id(*)),
        recommendations!original_id(anime:recommend_id(*)),
        relations!original_id(anime:relation_id(*))
      `
        )
        .eq("id", animeId)
        .single(),
    { refetchOnMount: true }
  );
};

export default useAnimeDetails;
