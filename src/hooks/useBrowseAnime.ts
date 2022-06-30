import { getPageMedia } from "@/services/anilist";
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  MediaType,
} from "@/types/anilist";
import { useInfiniteQuery } from "react-query";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: string[];
  seasonYear?: number;
  season?: MediaSeason;
  format?: MediaFormat;
  select?: string;
  limit?: number;
  tags?: string[];
  sort?: MediaSort;
  country?: string;
  status?: MediaStatus;
}

const useBrowse = (options: UseBrowseOptions) => {
  const {
    format,
    genres,
    keyword,
    season,
    seasonYear,
    sort,
    limit = 30,
    tags,
    country,
    status,
  } = options;

  return useInfiniteQuery(
    ["browse", options],
    async ({ pageParam = 1 }) => {
      const data = await getPageMedia({
        format,
        season,
        seasonYear,
        perPage: limit,
        countryOfOrigin: country,
        sort: [sort],
        status,
        page: pageParam,
        type: MediaType.Anime,
        ...(tags?.length && { tag_in: tags }),
        ...(genres?.length && { genre_in: genres }),
        ...(keyword && { search: keyword }),
        ...(!keyword && { isAdult: false }),
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

export default useBrowse;
