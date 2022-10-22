import { useUser } from "@/contexts/AuthContext";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import supabaseClient from "@/lib/supabase";

import { Read } from "@/types";

const useSavedRead = (mangaId: number) => {
  const user = useUser();

  return useSupabaseSingleQuery(
    ["read", mangaId],
    () =>
      supabaseClient
        .from<Read>("kaguya_read")
        .select("chapter:chapterId(*)")
        .eq("mediaId", mangaId)
        .eq("userId", user.id)
        .limit(1)
        .single(),
    {
      enabled: !!user,
      retry: 0,
    }
  );
};

export default useSavedRead;
