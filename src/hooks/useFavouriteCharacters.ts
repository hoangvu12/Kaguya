import supabase from "@/lib/supabase";
import { Character } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";

const useFavouriteCharacters = () => {
  return useSupabaseQuery(
    ["characters favourites"],
    () => {
      return supabase
        .from<Character>("kaguya_characters")
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
