import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Watched } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useRecommendedList = () => {
  const user = useUser();

  return useSupabaseSingleQuery(
    "recommended",
    () => {
      return supabase
        .from<Watched>("watched")
        .select(
          `
            anime:anime_id(
                title,
                vietnamese_title,
                recommendations!original_id(anime:recommend_id(*))
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

export default useRecommendedList;
