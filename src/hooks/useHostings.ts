import { Hosting } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import supabaseClient from "@/lib/supabase";

const useHostings = () => {
  return useSupabaseQuery(["hostings"], () =>
    supabaseClient.from<Hosting>("kaguya_hostings").select("*")
  );
};

export default useHostings;
