import config from "@/config";
import { Episode, Subtitle, VideoSource } from "@/types";
import axios, { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface ReturnSuccessType {
  success: true;
  sources: VideoSource[];
  subtitles?: Subtitle[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

const convertSources = (sources: VideoSource[], sourceId: string) =>
  sources.map((source) => {
    if (source.useProxy && !source.file.includes("m3u8")) {
      source.file = `${config.proxyServerUrl}?url=${encodeURIComponent(
        source.file
      )}&source_id=${sourceId}`;
    }

    return source;
  });

export const useFetchSource = (
  currentEpisode: Episode,
  nextEpisode?: Episode
) => {
  const queryClient = useQueryClient();

  const fetchSource = (episode: Episode) =>
    axios
      .get<ReturnSuccessType>(`${config.nodeServerUrl}/source`, {
        params: {
          episode_id: episode.sourceEpisodeId,
          source_media_id: episode.sourceMediaId,
          source_id: episode.sourceId,
        },
      })
      .then(({ data }) => {
        data.sources = convertSources(data.sources, episode.sourceId);

        return data;
      });

  const getQueryKey = (episode: Episode) =>
    `source-${episode.sourceId}-${episode.sourceEpisodeId}`;

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    getQueryKey(currentEpisode),
    () => fetchSource(currentEpisode),
    {
      onSuccess: () => {
        if (!nextEpisode?.sourceEpisodeId) return;

        queryClient.prefetchQuery(getQueryKey(nextEpisode), () =>
          fetchSource(nextEpisode)
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
