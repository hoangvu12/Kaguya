import { AnimeSourceConnection } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

interface UseUploadedEpisodesOptions {
  mediaId: number;
  sourceId: string;
}

const useUploadedEpisodes = (options: UseUploadedEpisodesOptions) => {
  return useQuery(["uploaded-episodes", { options }], async () => {
    const { data, error } = await supabaseClient
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(
        `
            mediaId,
            episodes:kaguya_episodes(
                *
            )
        `
      )
      .eq("sourceId", options.sourceId)
      .eq("mediaId", options.mediaId)
      .single();

    if (error) {
      return [];
    }

    return data?.episodes || [];
  });
};

export default useUploadedEpisodes;
