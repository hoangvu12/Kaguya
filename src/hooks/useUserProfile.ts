import supabaseClient from "@/lib/supabase";
import { AdditionalUser } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";

const useUserProfile = (user: AdditionalUser) => {
  return useSupabaseSingleQuery(
    ["user-profile", user.id],
    () => {
      return supabaseClient
        .from<AdditionalUser>("users")
        .select("*")
        .eq("id", user.id)
        .single();
    },
    {
      initialData: user,
    }
  );
};

export default useUserProfile;
