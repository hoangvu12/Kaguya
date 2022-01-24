import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Anime, Manga, SourceStatus } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useSourceStatus = <T extends "anime" | "manga">(
  type: T,
  source: T extends "anime" ? Anime : Manga
) => {
  const tableName = type === "anime" ? "watch_status" : "read_status";
  const queryKey = [tableName, source.ani_id];
  const filterKey = type === "anime" ? "anime_id" : "manga_id";
  const user = useUser();

  return useSupabaseSingleQuery<SourceStatus<T>>(
    queryKey,
    () => {
      return supabase
        .from(tableName)
        .select("*")
        .eq("user_id", user.id)
        .eq(filterKey, source.ani_id)
        .limit(1)
        .single();
    },
    { enabled: !!user }
  );
};

export default useSourceStatus;
