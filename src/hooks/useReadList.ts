import supabaseClient from "@/lib/supabase";
import { getMedia } from "@/services/anilist";
import { AdditionalUser, Read, SourceStatus } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { parseNumberFromString } from "@/utils";
import { useQuery } from "react-query";

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

const useWatchList = (
  sourceStatus: SourceStatus<MediaType.Manga>[],
  sourceType: Status,
  user: AdditionalUser
) => {
  return useQuery<MediaWithReadTime[]>(["read-list", sourceType], async () => {
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

    return media.map((m) => {
      const readData = read.find((w) => w.mediaId === m.id);

      return {
        ...m,
        readChapter: parseNumberFromString(readData?.chapter?.name || "0"),
      };
    });
  });
};

export default useWatchList;
