import supabase from "@/lib/supabase";
import { Read } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useUser } from "@/contexts/AuthContext";

const useRead = () => {
  const user = useUser();

  return useSupabaseQuery(
    "read",
    () => {
      return supabase
        .from<Read>("read")
        .select("manga:manga_id(*), chapter:chapter_id(name)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(15);
    },
    { enabled: !!user }
  );
};

export default useRead;
