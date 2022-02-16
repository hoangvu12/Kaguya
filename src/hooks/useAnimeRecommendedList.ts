import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Watched } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useAnimeRecommendedList = () => {
  const user = useUser();

  return useSupabaseSingleQuery(
    ["anime", "recommended"],
    () => {
      return supabase
        .from<Watched>("kaguya_watched")
        .select(
          `
            media:mediaId(
                title,
                vietnameseTitle,
                recommendations:kaguya_anime_recommendations!originalId(media:recommendationId(*))
            )
          `
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
    },
    { enabled: !!user }
  );
};

export default useAnimeRecommendedList;
