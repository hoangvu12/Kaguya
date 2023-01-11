import supabaseClient from "@/lib/supabase";
import { getMedia } from "@/services/anilist";
import { AdditionalUser, Read, SourceStatus } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { getPagination, parseNumberFromString } from "@/utils";
import { useInfiniteQuery } from "react-query";

export const STATUS = {
  All: "ALL",
  Reading: "READING",
  Completed: "COMPLETED",
  Planning: "PLANNING",
} as const;

export type StatusKey = keyof typeof STATUS;
export type Status = typeof STATUS[StatusKey];

interface MediaWithReadTime extends Media {
  readChapter: number;
}

const LIST_LIMIT = 30;

const useReadList = (sourceType: Status, user: AdditionalUser) => {
  return useInfiniteQuery(
    ["read-list", user.id, sourceType],
    async ({ pageParam = 1 }) => {
      const { from, to } = getPagination(pageParam, LIST_LIMIT);

      const sourceStatusQuery = supabaseClient
        .from<SourceStatus<MediaType.Manga>>("kaguya_read_status")
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
        type: MediaType.Manga,
        id_in: ids,
      });

      const { data: read } = await supabaseClient
        .from<Read>("kaguya_read")
        .select("mediaId, chapter:kaguya_chapters!chapterId(name)")
        .eq("userId", user.id)
        .in("mediaId", ids)
        .order("updated_at", { ascending: false });

      const hasNextPage =
        sourceStatus?.length && sourceStatus?.length === LIST_LIMIT;

      const list: MediaWithReadTime[] = media
        .sort((mediaA, mediaB) => {
          const readDataA = read.find((w) => w.mediaId === mediaA.id);
          const readDataB = read.find((w) => w.mediaId === mediaB.id);
          const sourceStatusA = sourceStatus.find(
            (s) => s.mediaId === mediaA.id
          );
          const sourceStatusB = sourceStatus.find(
            (s) => s.mediaId === mediaB.id
          );

          const readUpdatedA =
            readDataA?.updated_at || sourceStatusA?.created_at;
          const readUpdatedB =
            readDataB?.updated_at || sourceStatusB?.created_at;

          const readUpdatedATime = new Date(readUpdatedA).getTime();
          const readUpdatedBTime = new Date(readUpdatedB).getTime();

          return readUpdatedBTime - readUpdatedATime;
        })
        .map((m) => {
          const readData = read.find((w) => w.mediaId === m.id);

          return {
            ...m,
            readChapter: parseNumberFromString(readData?.chapter?.name || "0"),
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

export default useReadList;
