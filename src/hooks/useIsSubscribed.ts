import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Media } from "@/types/anilist";
import { useQuery } from "react-query";

const useIsSubscribed = <T extends "anime" | "manga">(
  type: T,
  source: Media
) => {
  const { user } = useUser();
  const tableName =
    type === "anime" ? "kaguya_anime_subscribers" : "kaguya_manga_subscribers";
  const queryKey = ["is_subscribed", user.id, source.id];

  return useQuery(
    queryKey,
    async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select("userId")
        .eq("userId", user.id)
        .eq("mediaId", source.id)
        .limit(1)
        .single();

      if (error) return false;

      return !!data;
    },
    { enabled: !!user }
  );
};

export default useIsSubscribed;
