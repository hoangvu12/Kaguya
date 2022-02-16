import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useMangaDetails = (mangaId: number) => {
  return useSupabaseSingleQuery(
    ["manga", mangaId],
    () =>
      supabase
        .from<Manga>("manga")
        .select(
          `
          *,
          characters:new_manga_characters!manga_id(*, character:character_id(*)),
          recommendations:manga_recommendations!original_id(manga:recommend_id(*)),
          relations:manga_relations!original_id(manga:relation_id(*))
      `
        )
        .eq("id", mangaId)
        .single(),
    { refetchOnMount: true }
  );
};

export default useMangaDetails;
