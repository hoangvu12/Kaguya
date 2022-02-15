import { Episode, VideoSource } from "@/types";
import axios, { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";

interface ReturnSuccessType {
  success: true;
  sources: VideoSource[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

export const useFetchSource = (
  currentEpisode: Episode,
  nextEpisode?: Episode
) => {
  const queryClient = useQueryClient();

  const fetchSource = (episodeId: number, sourceId: string) =>
    axios
      .get<ReturnSuccessType>(
        `/api/anime/source?episode_id=${episodeId}&source_id=${sourceId}`
      )
      .then(({ data }) => data);

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    `source-${currentEpisode.sourceEpisodeId}`,
    () => fetchSource(currentEpisode.sourceEpisodeId, currentEpisode.sourceId),
    {
      onSuccess: () => {
        if (!nextEpisode?.sourceEpisodeId) return;

        queryClient.prefetchQuery(
          `source-${nextEpisode?.sourceEpisodeId}`,
          () => fetchSource(nextEpisode.sourceEpisodeId, nextEpisode.sourceId)
        );
      },
    }
  );
};
