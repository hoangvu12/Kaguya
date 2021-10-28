import supabase from "@/lib/supabase";
import { Anime } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";

export const QUERY_KEY = "trending-anime";

const useTrendingAnime = () => {
  return useSupabaseQuery<Anime>(QUERY_KEY, () =>
    supabase.from<Anime>("anime").select("*").limit(15)
  );
};

export default useTrendingAnime;
