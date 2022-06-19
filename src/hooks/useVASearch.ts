import { getPageStaff } from "@/services/anilist";
import { StaffSort } from "@/types/anilist";
import { useInfiniteQuery } from "react-query";

const useVASearch = (keyword: string) => {
  return useInfiniteQuery(
    ["va", keyword],
    async ({ pageParam = 1 }) => {
      const data = await getPageStaff({
        search: keyword,
        page: pageParam,
        perPage: 30,
        sort: [StaffSort.Favourites_desc],
      });

      return data;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.pageInfo.hasNextPage
          ? lastPage.pageInfo.currentPage + 1
          : null,
    }
  );
};

export default useVASearch;
