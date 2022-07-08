import { Hosting } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";

const useHosting = (hostingId: string) => {
  return useSupabaseSingleQuery(["hosting", hostingId], () =>
    supabase.from<Hosting>("kaguya_hostings").select("*").eq("id", hostingId)
  );
};

export default useHosting;
