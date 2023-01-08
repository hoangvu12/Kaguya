import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";

import { SourceStatus } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useSourceStatus = <T extends MediaType.Anime | MediaType.Manga>(
  type: T,
  source: Media
) => {
  const tableName =
    type === MediaType.Anime ? "kaguya_watch_status" : "kaguya_read_status";
  const queryKey = [tableName, source.id];
  const user = useUser();

  return useSupabaseSingleQuery<SourceStatus<T>>(
    queryKey,
    () => {
      return supabaseClient
        .from(tableName)
        .select("*")
        .eq("userId", user.id)
        .eq("mediaId", source.id)
        .limit(1)
        .single();
    },
    { enabled: !!user }
  );
};

export default useSourceStatus;
