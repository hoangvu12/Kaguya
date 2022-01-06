import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useQueryClient } from "react-query";

const useAnimeList = () => {
  const queryClient = useQueryClient();

  return useSupabaseQuery(
    "anime-list",
    () => {
      return supabase
        .from<Anime>("anime")
        .select("*")
        .limit(100)
        .order("updated_at", { ascending: false });
    },
    {
      retry: 0,
      onSuccess: (data) => {
        data.forEach((anime) => {
          queryClient.setQueryData(["anime", anime.ani_id], anime);
        });
      },
    }
  );
};

export default useAnimeList;
