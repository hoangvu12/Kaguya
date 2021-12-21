import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Watched } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useSavedWatched = (animeId) => {
  const user = useUser();

  return useSupabaseSingleQuery(
    ["watched", animeId],
    () =>
      supabase
        .from<Watched>("watched")
        .select("episode_id")
        .eq("anime_id", animeId)
        .eq("user_id", user.id)
        .limit(1)
        .single(),
    {
      enabled: !!user,
      retry: 0,
    }
  );
};

export default useSavedWatched;
