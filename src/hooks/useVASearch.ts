import supabase from "@/lib/supabase";
import { useSupaInfiniteQuery } from "@/utils/supabase";

const useVASearch = (keyword: string) => {
  return useSupaInfiniteQuery(["va", keyword], (from, to) =>
    supabase
      .rpc("voice_actors_search", {
        keyword,
      })
      .select("*")
      .order("favourites", { ascending: false })
      .range(from, to)
  );
};

export default useVASearch;
