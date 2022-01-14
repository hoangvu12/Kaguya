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
        .from<Read>("read")
        .select(
          `
            manga:manga_id(
                title,
                vietnamese_title,
                recommendations:manga_recommendations!original_id(manga:recommend_id(*))
            )
          `
        )
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
    },
    { enabled: !!user }
  );
};

export default useMangaRecommendedList;
