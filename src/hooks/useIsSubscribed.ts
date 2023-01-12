import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";

import { Media, MediaType } from "@/types/anilist";
import { useQuery } from "react-query";

const useIsSubscribed = <T extends MediaType>(type: T, source: Media) => {
  const user = useUser();
  const tableName =
    type === MediaType.Anime
      ? "kaguya_anime_subscribers"
      : "kaguya_manga_subscribers";
  const queryKey = ["is_subscribed", user.id, source.id];

  return useQuery(
    queryKey,
    async () => {
      const { data, error } = await supabaseClient
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
