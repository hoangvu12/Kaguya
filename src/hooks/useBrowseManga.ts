import { getPageMedia } from "@/services/anilist";
import { Translation } from "@/types";
import {
  MediaFormat,
  MediaSort,
  MediaStatus,
  MediaType,
} from "@/types/anilist";
import { removeDup } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useInfiniteQuery } from "react-query";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: string[];
  format?: MediaFormat;
  limit?: number;
  tags?: string[];
  sort?: MediaSort;
  country?: string;
  status?: MediaStatus;
  isAdult?: boolean;
}

const useBrowse = (options: UseBrowseOptions) => {
  const {
    format,
    genres,
    keyword,
    sort,
    limit = 30,
    tags,
    country,
    status,
    isAdult,
  } = options;

  return useInfiniteQuery(
    ["browse-manga", options],
    async ({ pageParam = 1 }) => {
      let translationMediaIds: number[] = [];

      // Search media from translations
      if (keyword) {
        const { data: mediaTranslations } = await supabaseClient
          .from<Translation>("kaguya_translations")
          .select("mediaId")
          .eq("mediaType", MediaType.Manga)
          .textSearch("title", keyword, {
            type: "plain",
          });

        if (mediaTranslations?.length) {
          translationMediaIds = removeDup(
            mediaTranslations.map((translation) => translation.mediaId)
          );
        }
      }

      const searchData = await getPageMedia({
        type: MediaType.Manga,
        format,
        perPage: limit,
        countryOfOrigin: country,
        sort: [sort],
        status,
        page: pageParam,
        ...(tags?.length && { tag_in: tags }),
        ...(genres?.length && { genre_in: genres }),
        ...(keyword && { search: keyword }),
        isAdult:
          isAdult || genres.includes("Hentai") || genres.includes("Ecchi"),
      });

      // If translations are found, search the anime using id_in. Then append to anilist search results.
      if (translationMediaIds?.length) {
        const searchDataWithTranslations = await getPageMedia({
          id_in: translationMediaIds,
          type: MediaType.Manga,
        });

        const existingMediaIds = searchData?.media?.map((media) => media.id);

        searchDataWithTranslations?.media.forEach((media) => {
          if (!existingMediaIds?.includes(media.id)) {
            searchData?.media?.push(media);
          }
        });
      }

      return searchData;
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
