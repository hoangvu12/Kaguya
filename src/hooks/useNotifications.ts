import { Notification } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@/contexts/AuthContext";

const useNotifications = () => {
  const user = useUser();

  return useSupabaseQuery(
    ["notifications"],
    () => {
      return supabaseClient
        .from<Notification>("kaguya_notifications")
        .select(
          "*, sender:senderId(*), notificationUsers:kaguya_notification_users(*)"
        )
        .eq("receiverId", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
    },
    {
      enabled: !!user,
      refetchOnWindowFocus: true,
    }
  );
};

export default useNotifications;
