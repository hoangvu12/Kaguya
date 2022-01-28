import supabase from "@/lib/supabase";
import { useSupaInfiniteQuery } from "@/utils/supabase";

const useCharacterSearch = (keyword: string) => {
  return useSupaInfiniteQuery(["character", keyword], (from, to) => {
    const db = supabase.from("all_characters").select("*").range(from, to);

    if (keyword) {
      db.textSearch("name", keyword);
    }

    return db;
  });
};

export default useCharacterSearch;
