import { Reaction } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const useReaction = (type: string) => {
  return useSupabaseSingleQuery(
    ["reaction", type],
    () => {
      return supabaseClient
        .from<Reaction>("sce_reactions")
        .select("*")
        .eq("type", type)
        .single();
    },
    {
      staleTime: Infinity,
    }
  );
};

export default useReaction;
