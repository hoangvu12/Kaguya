import { getPageCharacters } from "@/services/anilist";
import { CharacterSort } from "@/types/anilist";
import { useInfiniteQuery } from "react-query";

const useCharacterSearch = (keyword: string) => {
  return useInfiniteQuery(
    ["character", keyword],
    async ({ pageParam = 1 }) => {
      const data = await getPageCharacters({
        search: keyword,
        page: pageParam,
        perPage: 30,
        sort: [CharacterSort.Favourites_desc],
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

export default useCharacterSearch;
