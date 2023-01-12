import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";

import { getMedia } from "@/services/anilist";
import { Watched } from "@/types";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";

const useWatched = () => {
  const user = useUser();

  return useQuery<Watched[]>(
    "watched",
    async () => {
      const { data, error } = await supabaseClient
        .from<Watched>("kaguya_watched")
        .select(
          "mediaId, episode:kaguya_episodes!episodeId(sourceEpisodeId, name, sourceId), watchedTime"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(isMobile ? 5 : 10);

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
