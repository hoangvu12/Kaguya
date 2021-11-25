import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

interface ReturnSuccessType {
  success: true;
  images: string[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

const useFetchImages = (slug: string, chapterId) => {
  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    `images-${chapterId}`,
    () =>
      axios
        .get(`/api/images?slug=${slug}&chapter_id=${chapterId}`)
        .then(({ data }: AxiosResponse<ReturnSuccessType>) => data)
  );
};

export default useFetchImages;
