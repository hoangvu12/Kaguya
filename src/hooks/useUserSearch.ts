import supabaseClient from "@/lib/supabase";
import { AdditionalUser } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";

const useUserSearch = (keyword: string) => {
  return useSupaInfiniteQuery(["user-list", keyword], (from, to) => {
    return supabaseClient
      .from<AdditionalUser>("users")
      .select("*")
      .range(from, to)
      .textSearch("username", `${keyword}:*`);
  });
};

export default useUserSearch;
