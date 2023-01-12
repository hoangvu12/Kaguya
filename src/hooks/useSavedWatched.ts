import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";

import { Watched } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useSavedWatched = (animeId: number) => {
  const user = useUser();

  return useSupabaseSingleQuery(
    ["watched", animeId],
    () =>
      supabaseClient
        .from<Watched>("kaguya_watched")
        .select("episode:episodeId(*), watchedTime, episodeNumber")
        .eq("mediaId", animeId)
        .eq("userId", user.id)
        .limit(1)
        .single(),
    {
      enabled: !!user,
      refetchOnMount: true,
    }
  );
};

export default useSavedWatched;
