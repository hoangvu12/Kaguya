import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Read } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useMangaRecommendedList = () => {
  const user = useUser();

  return useSupabaseSingleQuery(
    ["manga", "recommended"],
    () => {
      return supabase
        .from<Read>("kaguya_read")
        .select(
          `
            media:mediaId(
                title,
                vietnameseTitle,
                recommendations:kaguya_manga_recommendations!originalId(media:recommendationId(*))
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

export default useMangaRecommendedList;
