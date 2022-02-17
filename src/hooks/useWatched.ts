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
          "media:mediaId(id, title, vietnameseTitle, bannerImage, coverImage), episode:kaguya_episodes!episodeId(sourceEpisodeId, name, sourceId)"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(15);
    },
    { enabled: !!user }
  );
};

export default useWatched;
