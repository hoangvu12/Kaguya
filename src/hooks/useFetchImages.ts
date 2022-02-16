import { Chapter } from "@/types";
import axios, { AxiosError } from "axios";
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

const useFetchImages = (currentChapter: Chapter, nextChapter?: Chapter) => {
  const queryClient = useQueryClient();

  const fetchImages = (chapter: Chapter) =>
    axios
      .get<ReturnSuccessType>(
        `/api/manga/images?source_media_id=${chapter.sourceMediaId}&chapter_id=${chapter.sourceChapterId}&source_id=${chapter.sourceId}`
      )
      .then(({ data }) => data);

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    `images-${currentChapter.sourceChapterId}`,
    () => fetchImages(currentChapter),
    {
      onSuccess: () => {
        if (!nextChapter?.sourceChapterId) return;

        queryClient.prefetchQuery(
          `images-${nextChapter?.sourceChapterId}`,
          () => fetchImages(nextChapter)
        );
      },
    }
  );
};

export default useFetchImages;
