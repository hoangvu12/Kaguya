import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Anime, Manga } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { useQuery } from "react-query";

interface UseIsSubscribedProps {}

type Source<T> = T extends "anime" ? Anime : Manga;

const useIsSubscribed = <T extends "anime" | "manga">(
  type: T,
  source: Source<T>
) => {
  const user = useUser();
  const tableName =
    type === "anime" ? "anime_subscribers" : "manga_subscribers";
  const queryKey = ["is_subscribed", user.id, source.ani_id];
  const filterKey = type === "anime" ? "anime_id" : "manga_id";

  return useQuery(
    queryKey,
    async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select("user_id")
        .eq("user_id", user.id)
        .eq(filterKey, source.ani_id)
        .limit(1)
        .single();

      if (error) return false;

      return !!data;
    },
    { enabled: !!user }
  );
};

export default useIsSubscribed;
