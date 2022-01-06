import supabase from "@/lib/supabase";
import { Manga } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useQueryClient } from "react-query";

const useAnimeList = () => {
  const queryClient = useQueryClient();

  return useSupabaseQuery(
    "manga-list",
    () => {
      return supabase
        .from<Manga>("manga")
        .select("*")
        .limit(100)
        .order("updated_at", { ascending: false });
    },
    {
      retry: 0,
      onSuccess: (data) => {
        data.forEach((manga) => {
          queryClient.setQueryData(["manga", manga.ani_id], manga);
        });
      },
    }
  );
};

export default useAnimeList;
