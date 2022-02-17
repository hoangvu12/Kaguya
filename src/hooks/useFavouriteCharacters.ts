import supabase from "@/lib/supabase";
import { useSupabaseQuery } from "@/utils/supabase";

const useFavouriteCharacters = () => {
  return useSupabaseQuery(
    ["characters favourites"],
    () => {
      return supabase
        .from("kaguya_characters")
        .select("*")
        .limit(30)
        .order("favourites", { ascending: false });
    },
    {
      retry: 0,
    }
  );
};

export default useFavouriteCharacters;
