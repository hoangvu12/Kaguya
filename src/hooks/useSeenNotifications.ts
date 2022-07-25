import { Notification } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";

const convertToReadNotifcations = (notifications: Partial<Notification>[]) => {
  return notifications.map((notification) => ({
    ...notification,
    notificationUsers: notification.notificationUsers.map(
      (notificationUser) => {
        notificationUser.isRead = true;

        return notificationUser;
      }
    ),
  }));
};

const useSeenNotifications = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation<Notification[], PostgrestError, Notification[], any>(
    async (notifications) => {
      if (!user) throw new Error("User not logged in");

      const notifcationUsers = notifications
        .flatMap((notification) => notification.notificationUsers)
        .filter((notificationUser) => notificationUser.userId === user.id);

      const { data, error } = await supabaseClient
        .from("kaguya_notification_users")
        .upsert(notifcationUsers);

      if (error) throw error;

      return data;
    },
    {
      onMutate: (notifications) => {
        const readNotifications = convertToReadNotifcations(notifications);

        queryClient.setQueryData(["notifications"], readNotifications);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );
};

export default useSeenNotifications;
