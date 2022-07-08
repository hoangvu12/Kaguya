import { Hosting } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";

const useHostings = () => {
  return useSupabaseQuery(["hostings"], () =>
    supabase.from<Hosting>("kaguya_hostings").select("*")
  );
};

export default useHostings;
