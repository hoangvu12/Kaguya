import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useAnimeDetails = (mangaId: number) => {
  return useSupabaseSingleQuery(
    ["manga", mangaId],
    () =>
      supabase
        .from<Manga>("manga")
        .select(
          `
          *,
          characters:manga_characters(*),
          recommendations:manga_recommendations!original_id(manga:recommend_id(*)),
          relations:manga_relations!original_id(manga:relation_id(*))
      `
        )
        .eq("ani_id", mangaId)
        .single(),
    { refetchOnMount: true, enabled: typeof window !== "undefined" }
  );
};

export default useAnimeDetails;
