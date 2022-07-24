import { Reaction } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQueryClient } from "react-query";

const useReactions = () => {
  const queryClient = useQueryClient();

  return useSupabaseQuery(
    ["reactions"],
    () => {
      return supabaseClient
        .from<Reaction>("sce_reactions")
        .select("*")
        .order("type", { ascending: true });
    },
    {
      staleTime: Infinity,
      onSuccess: (data) => {
        data?.forEach((reaction) => {
          queryClient.setQueryData(["reaction", reaction.type], reaction);
        });
      },
    }
  );
};

export default useReactions;
