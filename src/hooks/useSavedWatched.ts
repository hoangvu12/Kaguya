import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Watched } from "@/types";
import Storage from "@/utils/storage";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useSavedWatched = (animeId: number) => {
  const user = useUser();
  const storage = new Storage("watched");

  const localStorageData =
    typeof window !== "undefined" &&
    storage.findOne<Watched>({ anime_id: animeId });

  return useSupabaseSingleQuery(
    ["watched", animeId],
    () =>
      supabase
        .from<Watched>("kaguya_watched")
        .select("episode:episodeId(*), watchedTime")
        .eq("mediaId", animeId)
        .eq("userId", user.id)
        .limit(1)
        .single(),
    {
      enabled: !!user,
      initialData: localStorageData,
      refetchOnMount: true,
    }
  );
};

export default useSavedWatched;
