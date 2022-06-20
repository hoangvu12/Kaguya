import { useUser } from "@supabase/auth-helpers-react";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Read } from "@/types";

const useSavedRead = (mangaId: number) => {
  const { user } = useUser();

  return useSupabaseSingleQuery(
    ["read", mangaId],
    () =>
      supabase
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
