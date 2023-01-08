import supabaseClient from "@/lib/supabase";
import { getMedia } from "@/services/anilist";
import { AdditionalUser, SourceStatus, Watched } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { parseNumberFromString } from "@/utils";
import { useQuery } from "react-query";

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

const useWatchList = (
  sourceStatus: SourceStatus<MediaType.Anime>[],
  sourceType: Status,
  user: AdditionalUser
) => {
  return useQuery<MediaWithWatchedTime[]>(
    ["watch-list", sourceType],
    async () => {
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

      return media.map((m) => {
        const watchedData = watched.find((w) => w.mediaId === m.id);

        return {
          ...m,
          watchedTime: watchedData?.watchedTime || 0,
          watchedEpisode: parseNumberFromString(
            watchedData?.episode?.name || "0"
          ),
        };
      });
    }
  );
};

export default useWatchList;
