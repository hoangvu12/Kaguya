import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { getMedia } from "@/services/anilist";
import { Watched } from "@/types";
import { fulfilledPromises } from "@/utils";
import { useQuery } from "react-query";

const useWatched = () => {
  const user = useUser();

  return useQuery<Watched[]>(
    "watched",
    async () => {
      const { data, error } = await supabase
        .from<Watched>("kaguya_watched")
        .select(
          "mediaId, episode:kaguya_episodes!episodeId(sourceEpisodeId, name, sourceId)"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(15);

      if (error) throw error;

      const anilistMedia = await getMedia({
        id_in: data.map((watched) => watched.mediaId),
      });

      return data.map((watched) => {
        const media = anilistMedia.find(
          (media) => media.id === watched.mediaId
        );

        return {
          ...watched,
          media,
        };
      });
    },
    { enabled: !!user }
  );
};

export default useWatched;
