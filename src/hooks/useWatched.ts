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
        .from<Watched>("kaguya_watched")
        .select(
<<<<<<< HEAD
          "media:mediaId(id, title, vietnameseTitle, bannerImage, coverImage), episode:kaguya_episodes!episodeId(id, name)"
=======
          "anime:anime_id(ani_id, title, vietnamese_title, banner_image, cover_image, episodes!episodes_anime_id_fkey(id)), episode:episode_id(id, episode_id, name, thumbnail_image)"
>>>>>>> c3d9d5400347adb7aa8420d4517bbfbe16808956
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(15);
    },
    { enabled: !!user }
  );
};

export default useWatched;
