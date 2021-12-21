import { useUser } from "@/contexts/AuthContext";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import supabase from "@/lib/supabase";
import { Read } from "@/types";

const useSavedRead = (mangaId: number) => {
  const user = useUser();

  return useSupabaseSingleQuery(
    ["read", mangaId],
    () =>
      supabase
        .from<Read>("read")
        .select("chapter_id")
        .eq("manga_id", mangaId)
        .eq("user_id", user.id)
        .limit(1)
        .single(),
    {
      enabled: !!user,
      retry: 0,
    }
  );
};

export default useSavedRead;
