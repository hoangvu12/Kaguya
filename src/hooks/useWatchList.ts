import supabaseClient from "@/lib/supabase";
import { getMedia } from "@/services/anilist";
import { AdditionalUser, SourceStatus, Watched } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { getPagination, parseNumberFromString } from "@/utils";
import { useInfiniteQuery } from "react-query";

export const STATUS = {
  All: "ALL",
  Watching: "WATCHING",
  Completed: "COMPLETED",
  Planning: "PLANNING",
} as const;
export type StatusKey = keyof typeof STATUS;
export type Status = typeof STATUS[StatusKey];

interface MediaWithWatchedTime extends Media {
  watchedTime: number;
  watchedEpisode: number;
}

const LIST_LIMIT = 30;

const useWatchList = (sourceType: Status, user: AdditionalUser) => {
  return useInfiniteQuery(
    ["watch-list", user.id, sourceType],
    async ({ pageParam = 1 }) => {
      const { from, to } = getPagination(pageParam, LIST_LIMIT);

      const sourceStatusQuery = supabaseClient
        .from<SourceStatus<MediaType.Anime>>("kaguya_watch_status")
        .select("mediaId, userId, status, created_at")
        .eq("userId", user.id)
        .order("mediaId", { ascending: false })
        .range(from, to);

      if (sourceType !== STATUS.All) {
        sourceStatusQuery.eq("status", sourceType);
      }

      const { data: sourceStatus, error } = await sourceStatusQuery;

      if (error) throw error;

      const ids = sourceStatus
        .filter((s) => {
          if (sourceType === STATUS.All) return true;

          return s.status === sourceType;
        })
        .map((s) => s.mediaId);

      const media = await getMedia({
        type: MediaType.Anime,
        id_in: ids,
      });

      const { data: watched } = await supabaseClient
        .from<Watched>("kaguya_watched")
        .select("mediaId, episode:kaguya_episodes!episodeId(name), watchedTime")
        .eq("userId", user.id)
        .in("mediaId", ids)
        .order("updated_at", { ascending: false });

      const hasNextPage =
        sourceStatus?.length && sourceStatus?.length === LIST_LIMIT;

      const list: MediaWithWatchedTime[] = media.map((m) => {
        const watchedData = watched.find((w) => w.mediaId === m.id);

        return {
          ...m,
          watchedTime: watchedData?.watchedTime || 0,
          watchedEpisode: parseNumberFromString(
            watchedData?.episode?.name || "0"
          ),
        };
      });

      return {
        data: list,
        nextPage: hasNextPage ? pageParam + 1 : null,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );
};

export default useWatchList;
