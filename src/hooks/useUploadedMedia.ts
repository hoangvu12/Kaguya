import { getMedia } from "@/services/anilist";
import {
  AnimeSourceConnection,
  MangaSourceConnection,
  SourceConnection,
} from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { getPagination } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

interface UseUploadedMediaOptions<T> {
  page: number;
  perPage?: number;
  sourceId: string;
  type: T;
}

const episodeQuery = `
  mediaId,
  episodes:kaguya_episodes(
      updated_at
  )
`;

const chapterQuery = `
  mediaId,
  chapters:kaguya_chapters(
      updated_at
  )
`;

export type MediaWithMediaUnit<T extends MediaType> = (T extends MediaType.Anime
  ? {
      totalUploadedEpisodes: number;
    }
  : {
      totalUploadedChapters: number;
    }) &
  Media;

export const getUploadedMedia = async <T extends MediaType>({
  page,
  perPage,
  sourceId,
  type,
}: UseUploadedMediaOptions<T>) => {
  const { from, to } = getPagination(page, perPage);

  const mediaSourceTableName =
    type === MediaType.Anime ? "kaguya_anime_source" : "kaguya_manga_source";

  const sortTable =
    type === MediaType.Anime ? "kaguya_episodes" : "kaguya_chapters";

  type Connection = T extends MediaType.Anime
    ? AnimeSourceConnection
    : MangaSourceConnection;

  const { data, error, count } = await supabaseClient
    .from<Connection>(mediaSourceTableName)
    .select(type === MediaType.Anime ? episodeQuery : chapterQuery, {
      count: "exact",
    })
    // @ts-ignore
    .eq("sourceId", sourceId)
    .order("updated_at", { ascending: false, foreignTable: sortTable })
    .range(from, to);

  if (error || !data?.length) {
    throw error || new Error("No source connections");
  }

  const mediaIds = data.map(({ mediaId }) => mediaId);

  const mediaList = await getMedia({ id_in: mediaIds, type });

  // @ts-ignore
  const mediaWithUnits: MediaWithMediaUnit<T>[] = data.map((connection) => {
    const media = mediaList.find((m) => m.id === connection.mediaId);

    if (!connection) return null;

    if ("episodes" in connection) {
      return {
        ...media,
        totalUploadedEpisodes: connection.episodes?.length || 0,
      };
    }

    if ("chapters" in connection) {
      return {
        ...media,
        totalUploadedChapters: connection.chapters?.length || 0,
      };
    }

    return null;
  });

  return {
    media: mediaWithUnits,
    total: count,
  };
};

const useUploadedMedia = <T extends MediaType>(
  options: UseUploadedMediaOptions<T>
) => {
  return useQuery(
    ["uploaded-media", { options }],
    () => getUploadedMedia(options),
    { staleTime: Infinity }
  );
};

export default useUploadedMedia;
