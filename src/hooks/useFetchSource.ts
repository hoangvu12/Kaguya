import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

interface ReturnSuccessType {
  success: true;
  url: string;
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

export const useFetchSource = (episodeId: number) => {
  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    `source-${episodeId}`,
    () =>
      axios
        .get(`/api/source?id=${episodeId}`)
        .then(({ data }: AxiosResponse<ReturnSuccessType>) => data)
  );
};
