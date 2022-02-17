import supabase from "@/lib/supabase";
import { useSupaInfiniteQuery } from "@/utils/supabase";

const useCharacterSearch = (keyword: string) => {
  return useSupaInfiniteQuery(["character", keyword], (from, to) =>
    supabase
      .rpc("characters_search", { keyword })
      .select("*")
      .range(from, to)
      .order("favourites", { ascending: false })
  );
};

export default useCharacterSearch;
