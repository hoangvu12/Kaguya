import supabase from "@/lib/supabase";
import { Watched } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import useUser from "./useUser";

const useWatched = () => {
  const user = useUser();

  return useSupabaseQuery(
    "watched",
    () => {
      return supabase
        .from<Watched>("watched")
        .select(
          "anime:anime_id(ani_id, title), episode:episode_id(name, thumbnail_image)"
        )
        .eq("user_id", user.id);
    },
    { enabled: !!user }
  );
};

export default useWatched;
