import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";

const mangaQuery = `
  *,
  user:user_id(*),
  manga:manga_id(ani_id, title, vietnamese_title)
`;

const animeQuery = `
  *,
  user:user_id(*),
  anime:anime_id(ani_id, title, vietnamese_title)
`;

const useNewestComments = <T extends "anime" | "manga">(type: T) => {
  const isAnime = type === "anime";

  return useSupabaseQuery(["newest-comments", type], () => {
    return supabase
      .from<Comment>("comments")
      .select(isAnime ? animeQuery : mangaQuery)
      .not(isAnime ? "anime_id" : "manga_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(15);
  });
};

export default useNewestComments;
