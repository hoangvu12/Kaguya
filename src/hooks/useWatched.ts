import supabase from "@/lib/supabase";
import { Watched } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useUser } from "@/contexts/AuthContext";

const useWatched = () => {
  const user = useUser();

  return useSupabaseQuery(
    "watched",
    () => {
      return supabase
        .from<Watched>("watched")
        .select(
          "anime:anime_id(ani_id, title, vietnamese_title, banner_image, cover_image, episodes!episodes_anime_id_fkey(id)), episode:episode_id(id, name, thumbnail_image)"
        )
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(15);
    },
    { enabled: !!user }
  );
};

export default useWatched;
