import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

interface SyncUser extends User {
  auth_role: "admin" | "user";
}

// Fetch user data from the server, not from the local storage or cookies
const useSyncUser = () => {
  const { user } = useUser();

  return useSupabaseSingleQuery<SyncUser>(
    "sync-user",
    () => {
      return supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .limit(1)
        .single();
    },
    { enabled: !!user, retry: 0 }
  );
};

export default useSyncUser;
