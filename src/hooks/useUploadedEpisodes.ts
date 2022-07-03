import { AnimeSourceConnection } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "react-query";

interface UseUploadedEpisodesOptions {
  mediaId: number;
  sourceId: string;
}

const useUploadedEpisodes = ({
  mediaId,
  sourceId,
}: UseUploadedEpisodesOptions) => {
  const queryClient = useQueryClient();

  return useQuery(
    ["uploaded-episodes", { mediaId, sourceId }],
    async () => {
      const { data, error } = await supabaseClient
        .from<AnimeSourceConnection>("kaguya_anime_source")
        .select(
          `
            mediaId,
            episodes:kaguya_episodes(
                *,
                video:kaguya_videos(*)
            )
        `
        )
        .eq("sourceId", sourceId)
        .eq("mediaId", mediaId)
        .single();

      if (error) {
        return [];
      }

      return data?.episodes || [];
    },
    {
      onSuccess(data) {
        data.forEach((episode) => {
          queryClient.setQueryData(["uploaded-episode", episode.slug], episode);
        });
      },
      refetchOnMount: true
    }
  );
};

export default useUploadedEpisodes;
