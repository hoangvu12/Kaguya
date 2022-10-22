import { Hosting } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import supabaseClient from "@/lib/supabase";

const useHosting = (hostingId: string) => {
  return useSupabaseSingleQuery(["hosting", hostingId], () =>
    supabaseClient
      .from<Hosting>("kaguya_hostings")
      .select("*")
      .eq("id", hostingId)
  );
};

export default useHosting;
