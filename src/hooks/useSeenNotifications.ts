import { Notification } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";

const convertToReadNotifcations = (notifications: Notification[]) => {
  return notifications.map(({ sender, ...notification }) => ({
    ...notification,
    isRead: true,
  }));
};

const useSeenNotifications = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation<Notification[], PostgrestError, Notification[], any>(
    async (notifications) => {
      if (!user) throw new Error("User not logged in");

      const readNotifications = convertToReadNotifcations(notifications);

      const { data, error } = await supabaseClient
        .from("kaguya_notifications")
        .upsert(readNotifications);

      if (error) throw error;

      return data;
    },
    {
      onMutate: (notifications) => {
        const readNotifications: Notification[] = notifications.map(
          (notification) => ({ ...notification, isRead: true })
        );

        queryClient.setQueryData(["notifications"], readNotifications);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );
};

export default useSeenNotifications;
