import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";

interface ReturnSuccessType {
  success: true;
  images: string[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

const useFetchImages = (
  slug: string,
  currentChapterId: number,
  nextChapterId: number | null
) => {
  const queryClient = useQueryClient();

  const fetchImages = (chapterId: number) =>
    axios
      .get<ReturnSuccessType>(
        `/api/manga/images?slug=${slug}&chapter_id=${chapterId}`
      )
      .then(({ data }) => data);

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    `images-${currentChapterId}`,
    () => fetchImages(currentChapterId),
    {
      onSuccess: () => {
        if (!nextChapterId) return;

        queryClient.prefetchQuery(`images-${nextChapterId}`, () =>
          fetchImages(nextChapterId)
        );
      },
    }
  );
};

export default useFetchImages;
