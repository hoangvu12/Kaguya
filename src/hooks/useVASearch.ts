import supabase from "@/lib/supabase";
import { VoiceActor } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";

const useVASearch = (keyword: string) => {
  return useSupaInfiniteQuery(["va", keyword], (from, to) =>
    supabase
      .rpc<VoiceActor>("voice_actors_search", {
        keyword,
      })
      .select("*")
      .order("favourites", { ascending: false })
      .range(from, to)
  );
};

export default useVASearch;
