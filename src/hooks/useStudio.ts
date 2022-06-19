import { getPageStudios, getStudioDetails } from "@/services/anilist";
import { Studio } from "@/types/anilist";
import { useInfiniteQuery } from "react-query";

export const useStudio = (studioId: number, initialData: Studio) => {
  return useInfiniteQuery<Studio>(
    ["studio", studioId],
    async ({ pageParam = 1 }) => {
      return getStudioDetails({
        id: studioId,
        page: pageParam,
        perPage: 50,
      });
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage?.media?.pageInfo?.hasNextPage
          ? lastPage?.media?.pageInfo?.currentPage + 1
          : null,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
    }
  );
};
