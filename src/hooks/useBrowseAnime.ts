import { getPageMedia } from "@/services/anilist";
import { Translation } from "@/types";
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  MediaType,
} from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
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
      let translationMediaIds = [];

      // Search media from translations
      if (keyword) {
        const { data: mediaTranslations } = await supabaseClient
          .from<Translation>("kaguya_translations")
          .select("mediaId")
          .eq("mediaType", MediaType.Anime)
          .textSearch("title", keyword, {
            type: "plain",
          });

        if (mediaTranslations?.length) {
          translationMediaIds = mediaTranslations.map(
            (translation) => translation.mediaId
          );
        }
      }

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
        // If media ids are found, search the media using id_in.
        ...(translationMediaIds?.length && { id_in: translationMediaIds }),
        ...(tags?.length && { tag_in: tags }),
        ...(genres?.length && { genre_in: genres }),
        // If keyword is given, but there is no media ids found, search the media using keyword.
        ...(keyword && !translationMediaIds?.length && { search: keyword }),
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
