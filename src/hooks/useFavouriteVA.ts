import supabase from "@/lib/supabase";
import { useSupabaseQuery } from "@/utils/supabase";

const useFavouriteVA = () => {
  return useSupabaseQuery(
    ["voice-actors favourites"],
    () => {
      return supabase
        .from("voice_actors")
        .select("*")
        .limit(30)
        .order("favourites", { ascending: false });
    },
    {
      retry: 0,
    }
  );
};

export default useFavouriteVA;
