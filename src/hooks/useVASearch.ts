import supabase from "@/lib/supabase";
import { useSupaInfiniteQuery } from "@/utils/supabase";

const useVASearch = (keyword: string) => {
  return useSupaInfiniteQuery(["va", keyword], (from, to) => {
    const db = supabase
      .rpc("voice_actors_search", {
        keyword,
      })
      .select("*")
      .select("*")
      .range(from, to);

    return db;
  });
};

export default useVASearch;
