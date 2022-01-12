import { Source } from "@/types";
import axios, { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";

interface ReturnSuccessType {
  success: true;
  sources: Source[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

export const useFetchSource = (
  currentEpisodeId: number,
  nextEpisodeId: number
) => {
  const queryClient = useQueryClient();

  const fetchSource = (episodeId: number) =>
    axios
      .get<ReturnSuccessType>(`/api/anime/source?id=${episodeId}`)
      .then(({ data }) => data);

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    `source-${currentEpisodeId}`,
    () => fetchSource(currentEpisodeId),
    {
      onSuccess: () => {
        if (!nextEpisodeId) return;

        queryClient.prefetchQuery(`source-${nextEpisodeId}`, () =>
          fetchSource(nextEpisodeId)
        );
      },
    }
  );
};
